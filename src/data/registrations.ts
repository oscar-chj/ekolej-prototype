import { EventRegistration } from "@/types/api.types";

// Mock data for event registrations
export const registrations: EventRegistration[] = [
  // Upcoming events (not attended yet)
  {
    id: "1",
    eventId: "1",
    studentId: "1",
    registrationDate: "2025-05-01",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "2",
    eventId: "1",
    studentId: "3",
    registrationDate: "2025-05-02",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "3",
    eventId: "2",
    studentId: "1",
    registrationDate: "2025-04-28",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "4",
    eventId: "2",
    studentId: "2",
    registrationDate: "2025-04-30",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "5",
    eventId: "3",
    studentId: "4",
    registrationDate: "2025-05-01",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "6",
    eventId: "3",
    studentId: "5",
    registrationDate: "2025-05-03",
    status: "Waitlisted",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "7",
    eventId: "4",
    studentId: "2",
    registrationDate: "2025-04-25",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },
  {
    id: "8",
    eventId: "5",
    studentId: "1",
    registrationDate: "2025-05-05",
    status: "Registered",
    attendanceMarked: false,
    pointsAwarded: 0,
  },

  // Completed event registrations with awarded points
  {
    id: "9",
    eventId: "11", // Campus Blood Donation Drive (6 points)
    studentId: "1",
    registrationDate: "2025-05-01",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 6,
  },
  {
    id: "10",
    eventId: "11", // Campus Blood Donation Drive
    studentId: "2",
    registrationDate: "2025-05-02",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 6,
  },
  {
    id: "11",
    eventId: "12", // Global Student Exchange Summit (10 points)
    studentId: "1",
    registrationDate: "2025-05-10",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 10,
  },
  {
    id: "12",
    eventId: "13", // Student Innovation Competition (9 points)
    studentId: "2",
    registrationDate: "2025-05-15",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 9,
  },
  {
    id: "13",
    eventId: "13", // Student Innovation Competition
    studentId: "3",
    registrationDate: "2025-05-16",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 9,
  },
  {
    id: "14",
    eventId: "14", // Annual Drama Performance Festival (3 points)
    studentId: "4",
    registrationDate: "2025-05-20",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 3,
  },
  {
    id: "15",
    eventId: "15", // National Mathematics Olympiad (10 points)
    studentId: "1",
    registrationDate: "2025-04-25",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 10,
  },
  {
    id: "16",
    eventId: "16", // Environmental Sustainability Workshop (4 points)
    studentId: "2",
    registrationDate: "2025-05-05",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 4,
  },
  {
    id: "17",
    eventId: "16", // Environmental Sustainability Workshop
    studentId: "5",
    registrationDate: "2025-05-06",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 4,
  },
  {
    id: "18",
    eventId: "14", // Annual Drama Performance Festival
    studentId: "3",
    registrationDate: "2025-05-22",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 3,
  },

  // Additional completed events to create realistic merit scenarios
  // Student 1 (Ahmad) - Exceeding target (should have 26 points + sample merits = well over 50)
  {
    id: "19",
    eventId: "17", // University Sports Competition (8 points)
    studentId: "1",
    registrationDate: "2025-04-15",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 8,
  },
  {
    id: "20",
    eventId: "18", // Academic Excellence Awards (7 points)
    studentId: "1",
    registrationDate: "2025-04-10",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 7,
  },
  {
    id: "21",
    eventId: "19", // Student Leadership Summit (5 points)
    studentId: "1",
    registrationDate: "2025-04-20",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 5,
  },

  // Student 2 (Sarah) - Just achieved target (should have around 50 points total)
  {
    id: "22",
    eventId: "17", // University Sports Competition
    studentId: "2",
    registrationDate: "2025-04-16",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 8,
  },
  {
    id: "23",
    eventId: "18", // Academic Excellence Awards
    studentId: "2",
    registrationDate: "2025-04-11",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 7,
  },
  {
    id: "24",
    eventId: "20", // Technology Innovation Fair (6 points)
    studentId: "2",
    registrationDate: "2025-04-22",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 6,
  },

  // Student 3 (Raj) - Working toward target (around 20-30 points)
  {
    id: "25",
    eventId: "17", // University Sports Competition
    studentId: "3",
    registrationDate: "2025-04-17",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 8,
  },
  {
    id: "26",
    eventId: "20", // Technology Innovation Fair
    studentId: "3",
    registrationDate: "2025-04-23",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 6,
  },

  // Student 4 (Li Wei) - Low participation (around 10 points)
  {
    id: "27",
    eventId: "19", // Student Leadership Summit
    studentId: "4",
    registrationDate: "2025-04-21",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 5,
  },
  {
    id: "28",
    eventId: "20", // Technology Innovation Fair
    studentId: "4",
    registrationDate: "2025-04-24",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 6,
  },

  // Student 5 - Some participation
  {
    id: "29",
    eventId: "18", // Academic Excellence Awards
    studentId: "5",
    registrationDate: "2025-04-12",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 7,
  },
  {
    id: "30",
    eventId: "19", // Student Leadership Summit
    studentId: "5",
    registrationDate: "2025-04-25",
    status: "Attended",
    attendanceMarked: true,
    pointsAwarded: 5,
  },
];
