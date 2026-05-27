import { eventBroker } from './events';
import { ActivityAction } from '../../generated/prisma/client';
import { emailService } from './services/emailService';
import * as nextServer from 'next/server';

// Get next.js after or unstable_after dynamically to be immune to next.js version variations
const afterFn = (nextServer as any).after || (nextServer as any).unstable_after;

/**
 * Execute a callback in the background safely.
 * If running inside a Next.js request context, it will defer execution until after the response completes.
 * Otherwise (e.g., scripts, seeders, or exceptions), it executes immediately.
 */
function runInBackground(callback: () => Promise<void> | void) {
  if (typeof afterFn === 'function') {
    try {
      afterFn(async () => {
        try {
          await callback();
        } catch (err) {
          console.error('[Background Task Error]:', err);
        }
      });
      return;
    } catch (e) {
      // Fallback if called outside a request context
    }
  }

  Promise.resolve(callback()).catch((err) => {
    console.error('[Immediate Task Fallback Error]:', err);
  });
}

// 1. Logger Subscriber - Persist every event to the ActivityLog table in the DB
Object.values(ActivityAction).forEach((action) => {
  eventBroker.on(action, (payload: any) => {
    runInBackground(async () => {
      const { prisma } = await import('../../prisma/prisma');
      
      await prisma.activityLog.create({
        data: {
          actorId: payload.actorId,
          action: action,
          studentId: payload.studentId || null,
          eventId: payload.eventId || null,
          details: payload,
        },
      });
      
      console.log(`[ActivityLog] Persisted action ${action} by actor ${payload.actorId}`);
    });
  });
});

// 2. Notifier Subscriber - Listen for events and trigger emails in the background

// A. Merit Added Notification
eventBroker.on(ActivityAction.MERIT_ADDED, (payload) => {
  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    const student = await prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { name: true, email: true, emailSubscribed: true },
    });

    if (student && student.email && student.emailSubscribed) {
      await emailService.sendEmail({
        to: student.email,
        subject: `Merit Points Awarded: +${payload.points} Points`,
        template: 'MERIT_ADDED',
        props: {
          recipientName: student.name || 'Student',
          points: payload.points,
          category: payload.category,
          description: payload.description,
          totalMeritPoints: payload.newTotal,
          targetPoints: 50,
        },
      });
    }
  });
});

// B. Merit Updated Notification
eventBroker.on(ActivityAction.MERIT_UPDATED, (payload) => {
  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    const student = await prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { name: true, email: true, emailSubscribed: true },
    });

    if (student && student.email && student.emailSubscribed) {
      await emailService.sendEmail({
        to: student.email,
        subject: `Merit Record Updated: ${payload.description}`,
        template: 'MERIT_UPDATED',
        props: {
          recipientName: student.name || 'Student',
          points: payload.points,
          category: payload.category,
          description: payload.description,
          totalMeritPoints: payload.newTotal,
          oldPoints: payload.oldPoints,
        },
      });
    }
  });
});

// C. Registration Confirmed/Waitlisted Notification
eventBroker.on(ActivityAction.REGISTRATION_COMPLETED, (payload) => {
  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    const student = await prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { name: true, email: true, emailSubscribed: true },
    });

    if (student && student.email && student.emailSubscribed) {
      const isWaitlisted = payload.registrationId.startsWith('waitlist') || payload.registrationId === 'WAITLISTED'; 
      // Note: We check if payload has waitlisted details or registration status
      // We will make sure the trigger passes proper indicators if needed.
      
      await emailService.sendEmail({
        to: student.email,
        subject: isWaitlisted
          ? `Added to Waitlist: ${payload.eventTitle}`
          : `Registration Confirmed: ${payload.eventTitle}`,
        template: isWaitlisted ? 'REGISTRATION_WAITLISTED' : 'REGISTRATION_COMPLETED',
        props: {
          recipientName: student.name || 'Student',
          eventTitle: payload.eventTitle,
          eventCategory: payload.eventCategory,
          eventPoints: payload.eventPoints,
          eventDate: payload.eventDate,
          eventTime: payload.eventTime,
          eventLocation: payload.eventLocation,
        },
      });
    }
  });
});

// D. Registration Cancelled Notification
eventBroker.on(ActivityAction.REGISTRATION_CANCELLED, (payload) => {
  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    const student = await prisma.user.findUnique({
      where: { id: payload.studentId },
      select: { name: true, email: true, emailSubscribed: true },
    });

    if (student && student.email && student.emailSubscribed) {
      await emailService.sendEmail({
        to: student.email,
        subject: `Registration Cancelled: ${payload.eventTitle}`,
        template: 'REGISTRATION_CANCELLED',
        props: {
          recipientName: student.name || 'Student',
          eventTitle: payload.eventTitle,
          eventDate: payload.eventDate,
          wasPromotedFromWaitlist: payload.wasPromotedFromWaitlist,
        },
      });
    }
  });
});

// E. Event Created Announcement (Broadcast to all subscribed students)
eventBroker.on(ActivityAction.EVENT_CREATED, (payload) => {
  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT', emailSubscribed: true },
      select: { name: true, email: true },
    });

    const batchOptions = students
      .filter((s) => s.email)
      .map((student) => ({
        to: student.email!,
        subject: `New Event: ${payload.title}`,
        template: 'EVENT_CREATED' as const,
        props: {
          recipientName: student.name || 'Student',
          eventTitle: payload.title,
          eventCategory: payload.category,
          eventPoints: payload.points,
          eventCapacity: payload.capacity,
          eventDate: payload.date,
          eventTime: payload.time,
          eventLocation: payload.location,
        },
      }));

    if (batchOptions.length > 0) {
      await emailService.sendBatch(batchOptions).catch((err) => {
        console.error('[Broadcast Error] Failed to send batch event announcements:', err);
      });
    }
  });
});

// F. Event Status Changed / Cancelled Notification (Notify all registered/waitlisted students)
eventBroker.on(ActivityAction.EVENT_STATUS_CHANGED, (payload) => {
  if (payload.newStatus !== 'CANCELLED') return;

  runInBackground(async () => {
    const { prisma } = await import('../../prisma/prisma');
    
    // Get all registrations (confirmed and waitlisted) for this event
    const registrations = await prisma.eventRegistration.findMany({
      where: { 
        eventId: payload.eventId,
        status: { in: ['REGISTERED', 'WAITLISTED'] }
      },
      include: {
        student: {
          select: { id: true, name: true, email: true, emailSubscribed: true },
        },
        event: {
          select: { title: true, date: true },
        }
      }
    });

    const batchOptions = registrations
      .filter((reg) => reg.student && reg.student.email && reg.student.emailSubscribed)
      .map((reg) => {
        const eventDateStr = reg.event.date instanceof Date 
          ? reg.event.date.toLocaleDateString() 
          : String(reg.event.date);

        return {
          to: reg.student.email!,
          subject: `Important: Event Cancelled - ${reg.event.title}`,
          template: 'EVENT_CANCELLED' as const,
          props: {
            recipientName: reg.student.name || 'Student',
            eventTitle: reg.event.title,
            eventDate: eventDateStr,
            cancellationReason: 'This event has been cancelled by the administrator.',
          },
        };
      });

    if (batchOptions.length > 0) {
      await emailService.sendBatch(batchOptions).catch((err) => {
        console.error('[Cancellation Notify Error] Failed to send batch cancellations:', err);
      });
    }
  });
});
