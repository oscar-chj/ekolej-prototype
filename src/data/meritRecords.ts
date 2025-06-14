import { MeritRecord, EventCategory } from "@/types/api.types";

/**
 * Mock data for merit records
 * This simulates data that would come from a database in a production application
 */
export const meritRecords: MeritRecord[] = [
  {
    id: "1",
    studentId: "1",
    eventId: "12",
    category: EventCategory.UNIVERSITY,
    points: 100,
    description: "Participated in International Student Exchange Program",
    date: "2025-05-15",
  },
  {
    id: "2",
    studentId: "1",
    eventId: "13",
    category: EventCategory.FACULTY,
    points: 90,
    description: "Won Faculty Innovation Challenge",
    date: "2025-05-20",
  },
  {
    id: "3",
    studentId: "1",
    eventId: "11",
    category: EventCategory.COLLEGE,
    points: 60,
    description: "Participated in Campus Blood Donation Drive",
    date: "2025-05-10",
  },
  {
    id: "4",
    studentId: "1",
    eventId: "14",
    category: EventCategory.ASSOCIATION,
    points: 30,
    description: "Performed in Drama Club Annual Performance",
    date: "2025-05-25",
  },
  {
    id: "5",
    studentId: "2",
    eventId: "12",
    category: EventCategory.UNIVERSITY,
    points: 100,
    description: "Participated in International Student Exchange Program",
    date: "2025-05-15",
  },
  {
    id: "6",
    studentId: "2",
    eventId: "13",
    category: EventCategory.FACULTY,
    points: 90,
    description: "Won Faculty Innovation Challenge",
    date: "2025-05-20",
  },
  {
    id: "7",
    studentId: "3",
    eventId: "11",
    category: EventCategory.COLLEGE,
    points: 60,
    description: "Participated in Campus Blood Donation Drive",
    date: "2025-05-10",
  },
  {
    id: "8",
    studentId: "3",
    eventId: "14",
    category: EventCategory.ASSOCIATION,
    points: 30,
    description: "Performed in Drama Club Annual Performance",
    date: "2025-05-25",
  },
  // Merit records for student admins
  {
    id: "9",
    studentId: "admin1", // Amirah Binti Zakaria
    eventId: "1",
    category: EventCategory.UNIVERSITY,
    points: 85,
    description: "Led University Orientation Committee",
    date: "2025-04-10",
  },
  {
    id: "10",
    studentId: "admin1",
    eventId: "3",
    category: EventCategory.FACULTY,
    points: 75,
    description: "Mentored junior students in Information Systems",
    date: "2025-05-01",
  },
  {
    id: "11",
    studentId: "admin1",
    category: EventCategory.COLLEGE,
    points: 50,
    description: "Organized College Merit System Workshop",
    date: "2025-05-10",
  },
  {
    id: "12",
    studentId: "admin2", // Marcus Lim Wei Jun
    eventId: "2",
    category: EventCategory.UNIVERSITY,
    points: 70,
    description: "Represented university in Inter-University Hackathon",
    date: "2025-04-20",
  },
  {
    id: "13",
    studentId: "admin2",
    category: EventCategory.ASSOCIATION,
    points: 40,
    description: "Led Software Engineering Society technical workshop",
    date: "2025-05-12",
  },
];
