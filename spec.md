# Specification: SMMS Email & Event-Driven Logging Service

This document defines the technical specification and implementation phases for the event-driven **Email and Activity Logging Service** within the Student Merit Management System (SMMS).

---

## 1. System Architecture

To ensure a decoupled, transactional, and responsive system, we employ a **Service-Oriented Event-Driven Architecture** integrated with the existing Next.js and Prisma layers.

```mermaid
flowchart TD
    subgraph Triggering Layer (Server Actions / Services)
        SA[Server Action / Service] -->|Executes DB Action| DB[(PostgreSQL)]
        SA -->|Emits Event Async| EventBroker[Event Broker]
    end

    subgraph Async Background Execution (Next.js 15 after API)
        EventBroker -->|Schedule Event Job| NextAfter[Next.js 15 after()]
    end

    subgraph Service Subscribers
        NextAfter -->|Write Log Entry| LoggerSub[Activity Logger]
        NextAfter -->|Generate & Send Email| EmailSub[Email Notifier]
    end

    subgraph Persistence & Delivery
        LoggerSub -->|Inserts| ActivityLogTable[(ActivityLog Table)]
        EmailSub -->|Render Template| ReactEmail[React Email Components]
        ReactEmail -->|Delivers via Resend API| Resend[Resend Mail Service]
    end
```

### Key Architectural Decisions:
1. **Relational Event Log (Audit Trail):** All broadcasted and transactional event histories will be persisted locally in the primary database via a new `ActivityLog` Prisma model. This ensures complete transactional integrity.
2. **Next.js 15 `after()` API for Async Processing:** To prevent external API call latency (such as waiting for Resend to respond) from slowing down client responses, we will use Next.js 15's built-in `after()` function. It schedules work to run in the background after the HTTP response has been sent back to the client. This is the absolute easiest and most robust serverless-compatible queue solution.
3. **Resend Email Components & API:** Emails will be designed using modern React components matching Resend/React Email guidelines, allowing us to compose premium, visual newsletters and transactional mails.
4. **Batch Sending / Broadcasts:** For events affecting multiple students (e.g., event cancellations or announcement of a new event), we will utilize Resend's batch delivery APIs to distribute notifications efficiently.

---

## 2. Database Schema Additions

We will modify the `User` model to track notification subscriptions and append the new `ActivityLog` model and `ActivityAction` enum to the `prisma/schema.prisma` file:

```prisma
// Modified User model field to support Subscribe/Unsubscribe
model User {
  // ... existing fields
  emailSubscribed   Boolean             @default(true) // Tracks if student/admin wants to receive email notifications
}

enum ActivityAction {
  MERIT_ADDED
  MERIT_UPDATED
  MERIT_DELETED
  REGISTRATION_COMPLETED
  REGISTRATION_WAITLISTED
  REGISTRATION_CANCELLED
  EVENT_CREATED
  EVENT_UPDATED
  EVENT_CANCELLED
}

model ActivityLog {
  id          String         @id @default(cuid())
  actorId     String         // The User ID of who initiated the action (e.g., Admin, Student, System)
  action      ActivityAction
  studentId   String?        // Target student affected by this action (if applicable)
  eventId     String?        // Target event associated with this action (if applicable)
  details     Json           // Flexible storage for payload context (e.g., merit points, change diffs, descriptions)
  createdAt   DateTime       @default(now())

  // Relations
  student     User?          @relation(fields: [studentId], references: [id], onDelete: SetNull)
  event       Event?         @relation(fields: [eventId], references: [id], onDelete: SetNull)

  @@index([studentId])
  @@index([eventId])
  @@index([createdAt])
}
```

---

## 3. Email Notification Matrix

We define specific event-driven notifications mapping to distinct student and admin recipients:

| Event Type | Trigger | Recipient(s) | Email Purpose / Copy |
| :--- | :--- | :--- | :--- |
| **`EVENT_CREATED`** | Admin publishes a new event | **Broadcast:** All active students | Announces the new event, its category, merit points, and provides a direct registration link. |
| **`REGISTRATION_COMPLETED`** | Student registers successfully | **Transactional:** Registered student & Event organizer | Confirms attendance reservation, date, time, location, and points potential. |
| **`REGISTRATION_WAITLISTED`** | Student registers but capacity is full | **Transactional:** Waitlisted student | Informs the student they are on the waitlist and will be automatically enrolled if a slot opens. |
| **`REGISTRATION_CANCELLED`** | Student cancels their slot | **Transactional:** Student, Event organizer, & newly enrolled waitlisted student | Confirms cancellation. Triggers automatic waitlist promotion notification to the next student. |
| **`MERIT_ADDED`** | Admin awards merit records | **Transactional:** Receiving student | Celebrates the merit points added, displays category breakdown, and shows progress towards their semester target. |
| **`MERIT_UPDATED`** | Admin modifies an existing merit record | **Transactional:** Affected student | Explains point modifications or category adjustments with admin-written rationale. |
| **`EVENT_CANCELLED`** | Admin cancels/removes an event | **Batch Broadcast:** All registered students & organizer | Notifies attendees of cancellation, details any impact on pending merits, and suggests alternative events. |

---

## 4. Extreme Prototyping Roadmap (1 Phase per Commit)

To maintain a clean repository structure, each phase will be developed, fully verified, and committed individually.

### Commit Phase 1: Email Templates & Dev Previewer UI
*   **Deliverables:** Lofi, clean React Email / Resend template components and an in-app browser dashboard for testing templates and mock user subscription preferences.
*   **Key Tasks:**
    - Install necessary package dependencies (`resend`, `@react-email/components` if needed, or implement lightweight custom React Email components).
    - Design clean, **lofi presets** (highly readable, uncluttered layouts with black-and-gray styled structures) matching the SMMS typography, complete with a footer containing a mock "Unsubscribe" link.
    - Create a developer route `/admin/email-preview` inside the Next.js App Router.
    - Build a **Mock Profile Subscription Settings Toggle** (Subscribe / Unsubscribe buttons/toggles) within the previewer/app UI, showing how a user can toggle their subscription preferences.
    - Build an interactive template dashboard with mock data selectors and a live-rendering iframe showing the lofi email layout.
*   **Verification:** Navigate to `/admin/email-preview` and verify rendering of all templates, the functioning of the mock profile subscribe/unsubscribe settings, and that the unsubscribe links in the footer work correctly.

### Commit Phase 2: Local Mock Service & HTML Sandboxing
*   **Deliverables:** Functional database trigger mock-ups that write outputs locally to files.
*   **Key Tasks:**
    - Abstract `EmailService` behind a common contract.
    - Implement `MockEmailService` which writes generated email HTML outputs into `scratch/sent-emails/[timestamp]-[recipient].html`.
    - Integrate triggers into existing Server Actions and Services (e.g. `meritActions.ts`, `eventService.ts`).
    - Add a "Local Sent Outbox" tab to `/admin/email-preview` displaying these locally dumped files with a viewer.
*   **Verification:** Trigger registrations or upload merits in the UI, and verify that mock HTML files are written correctly and display in the Outbox dashboard.

### Commit Phase 3: Relational DB Activity Log & Event-Driven Emitter
*   **Deliverables:** Decoupled event broker, background `after()` processing, and Prisma schema updates.
*   **Key Tasks:**
    - Append the `ActivityLog` model to `prisma/schema.prisma`, execute `yarn db:migrate:dev`, and regenerate the Prisma client.
    - Build `src/lib/events.ts` wrapping a Node `EventEmitter`.
    - Emit events in Server Actions instead of calling services directly.
    - Create subscribers utilizing Next.js 15 `after()` to log activity and trigger emails in the background.
*   **Verification:** Run action operations and confirm that database entries are populated transactionally in the `ActivityLog` table (viewable via Prisma Studio or dashboard) without delaying page responsiveness.

### Commit Phase 4: Production Resend Integration & Batch Delivery
*   **Deliverables:** Production delivery pipeline, batch operations, and secret configurations.
*   **Key Tasks:**
    - Connect the official `resend` client with `process.env.RESEND_API_KEY`.
    - Swap `MockEmailService` for `ResendEmailService` in production environments.
    - Implement batch send logic for broadcasts (e.g. Event Announcements and Cancellations).
    - Fully test live email deliveries using sandbox emails.
*   **Verification:** Perform end-to-end tests triggering real emails to sandbox test addresses, confirming flawless formatting and instant delivery.
