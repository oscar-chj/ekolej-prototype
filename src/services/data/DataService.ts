/**
 * Centralized Data Service
 *
 * This service acts as the single source of truth for all application data.
 * In a real application, this would interface with a database.
 *
 * Data Flow:
 * Events (source) → Registrations → Merit Records → Student Metrics → Leaderboard
 */

import {
  Event,
  EventRegistration,
  MeritRecord,
  Student,
  EventCategory,
} from "@/types/api.types";

// Core data sources (simulating database tables)
import { events } from "../../data/events";
import { students } from "../../data/students";
import { registrations } from "../../data/registrations";

/**
 * Centralized Data Service Class
 */
export class DataService {
  // ===== CORE DATA GETTERS =====

  /**
   * Get all events (source of truth)
   */
  static getEvents(): Event[] {
    return events;
  }

  /**
   * Get all students
   */
  static getStudents(): Student[] {
    return students;
  }

  /**
   * Get all registrations
   */
  static getRegistrations(): EventRegistration[] {
    return registrations;
  }

  /**
   * Get event by ID
   */
  static getEventById(eventId: string): Event | undefined {
    return events.find((event: Event) => event.id === eventId);
  }

  /**
   * Get student by ID
   */
  static getStudentById(studentId: string): Student | undefined {
    return students.find((student: Student) => student.id === studentId);
  }

  // ===== DERIVED DATA (CALCULATED FROM CORE DATA) =====

  /**
   * Generate merit records from events and registrations
   * This simulates how merit records would be created in a real system
   */
  static generateMeritRecords(): MeritRecord[] {
    const meritRecords: MeritRecord[] = [];

    // Find completed events with attendance marked
    const completedRegistrations = registrations.filter(
      (reg: EventRegistration) => reg.attendanceMarked && reg.pointsAwarded > 0
    );

    completedRegistrations.forEach((registration: EventRegistration) => {
      const event = this.getEventById(registration.eventId);
      if (event) {
        meritRecords.push({
          id: `merit_${registration.id}`,
          studentId: registration.studentId,
          eventId: registration.eventId,
          category: event.category,
          points: registration.pointsAwarded,
          description: event.title, // Use event title instead of description
          date: event.date,
        });
      }
    });

    // Add some sample merit records for demonstration
    this.addSampleMeritRecords(meritRecords);

    return meritRecords;
  }

  /**
   * Get merit records for a specific student
   */
  static getStudentMeritRecords(studentId: string): MeritRecord[] {
    return this.generateMeritRecords().filter(
      (record: MeritRecord) => record.studentId === studentId
    );
  }

  /**
   * Calculate student merit summary
   */
  static getStudentMeritSummary(studentId: string) {
    const meritRecords = this.getStudentMeritRecords(studentId);
    const summary = {
      totalPoints: 0,
      universityMerit: 0,
      facultyMerit: 0,
      collegeMerit: 0,
      clubMerit: 0,
      recentActivities: 0,
      rank: 1,
      totalStudents: students.length,
      targetPoints: 50,
      progressPercentage: 0,
      targetAchieved: false,
      remainingPoints: 0,
      exceededPoints: 0,
    };

    meritRecords.forEach((record: MeritRecord) => {
      summary.totalPoints += record.points;
      switch (record.category) {
        case EventCategory.UNIVERSITY:
          summary.universityMerit += record.points;
          break;
        case EventCategory.FACULTY:
          summary.facultyMerit += record.points;
          break;
        case EventCategory.COLLEGE:
          summary.collegeMerit += record.points;
          break;
        case EventCategory.CLUB:
          summary.clubMerit += record.points;
          break;
      }
    });

    // Count recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    summary.recentActivities = meritRecords.filter(
      (record: MeritRecord) => new Date(record.date) > thirtyDaysAgo
    ).length; // Calculate progress percentage and status
    summary.progressPercentage = Math.min(
      Math.round((summary.totalPoints / summary.targetPoints) * 100),
      100
    );

    // Add target achievement status
    const targetAchieved = summary.totalPoints >= summary.targetPoints;
    const remainingPoints = targetAchieved
      ? 0
      : summary.targetPoints - summary.totalPoints;
    const exceededPoints = targetAchieved
      ? summary.totalPoints - summary.targetPoints
      : 0;

    // Add new fields for better UI handling
    summary.targetAchieved = targetAchieved;
    summary.remainingPoints = remainingPoints;
    summary.exceededPoints = exceededPoints;

    // Calculate rank
    const allStudentTotals = students
      .map((student: Student) => ({
        studentId: student.id,
        total: this.getStudentMeritRecords(student.id).reduce(
          (sum: number, r: MeritRecord) => sum + r.points,
          0
        ),
      }))
      .sort((a, b) => b.total - a.total);

    summary.rank =
      allStudentTotals.findIndex((s) => s.studentId === studentId) + 1;

    return summary;
  }
  /**
   * Generate leaderboard data from merit records
   */
  static getLeaderboardData(
    sortBy: "total" | "university" | "faculty" | "college" | "club" = "total"
  ) {
    const leaderboardData = students.map((student: Student) => {
      const meritRecords = this.getStudentMeritRecords(student.id);

      const data = {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        faculty: student.faculty,
        year: student.year,
        totalPoints: 0,
        universityMerit: 0,
        facultyMerit: 0,
        collegeMerit: 0,
        clubMerit: 0,
      };

      meritRecords.forEach((record: MeritRecord) => {
        data.totalPoints += record.points;

        switch (record.category) {
          case EventCategory.UNIVERSITY:
            data.universityMerit += record.points;
            break;
          case EventCategory.FACULTY:
            data.facultyMerit += record.points;
            break;
          case EventCategory.COLLEGE:
            data.collegeMerit += record.points;
            break;
          case EventCategory.CLUB:
            data.clubMerit += record.points;
            break;
        }
      });

      return data;
    });

    // Sort based on the requested criteria
    switch (sortBy) {
      case "university":
        return leaderboardData.sort(
          (a, b) => b.universityMerit - a.universityMerit
        );
      case "faculty":
        return leaderboardData.sort((a, b) => b.facultyMerit - a.facultyMerit);
      case "college":
        return leaderboardData.sort((a, b) => b.collegeMerit - a.collegeMerit);
      case "club":
        return leaderboardData.sort((a, b) => b.clubMerit - a.clubMerit);
      default:
        return leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
    }
  }

  /**
   * Get dashboard summary data
   */
  static getDashboardSummary(studentId: string) {
    const student = this.getStudentById(studentId);
    const meritSummary = this.getStudentMeritSummary(studentId);
    const studentRegistrations = registrations.filter(
      (reg: EventRegistration) => reg.studentId === studentId
    ); // Get upcoming events (all upcoming events, not just registered ones)
    const upcomingEvents = events
      .filter((event: Event) => event.status === "Upcoming")
      .slice(0, 5); // Show top 5 upcoming events

    return {
      student,
      meritSummary,
      upcomingEvents,
      totalRegistrations: studentRegistrations.length,
      recentActivities: meritSummary.recentActivities,
    };
  }
  /**
   * Get recent activities for a student (events they attended in the last 30 days)
   */
  static getStudentRecentActivities(studentId: string) {
    const meritRecords = this.getStudentMeritRecords(studentId);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return meritRecords
      .filter((record: MeritRecord) => new Date(record.date) > thirtyDaysAgo)
      .map((record: MeritRecord) => {
        const event = record.eventId ? this.getEventById(record.eventId) : null;
        return {
          id: record.id,
          eventTitle: event?.title || record.description,
          category: record.category,
          points: record.points,
          date: record.date,
          completed: true,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // ===== HELPER METHODS =====
  /**
   * Add sample merit records for demonstration
   */
  private static addSampleMeritRecords(meritRecords: MeritRecord[]): void {
    // Get recent dates for realistic "recent activities"
    const today = new Date();
    const recentDates = [
      new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 5 days ago
      new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 10 days ago
      new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 15 days ago
      new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 20 days ago
      new Date(today.getTime() - 25 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 25 days ago
      new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 40 days ago (older)
    ];

    const sampleMerits: Omit<MeritRecord, "id">[] = [
      {
        studentId: "1", // Ahmad - Recent activities
        eventId: "event_001",
        category: EventCategory.UNIVERSITY,
        points: 15,
        description: "International Programming Competition",
        date: recentDates[0], // 5 days ago
      },
      {
        studentId: "1",
        eventId: "event_002",
        category: EventCategory.FACULTY,
        points: 12,
        description: "AI Research Presentation",
        date: recentDates[1], // 10 days ago
      },
      {
        studentId: "1",
        eventId: "event_003",
        category: EventCategory.COLLEGE,
        points: 6,
        description: "College Sports Tournament",
        date: recentDates[2], // 15 days ago
      },
      {
        studentId: "1",
        eventId: "event_004",
        category: EventCategory.UNIVERSITY,
        points: 20,
        description: "Hackathon Winner",
        date: recentDates[3], // 20 days ago
      },
      {
        studentId: "1",
        eventId: "event_005",
        category: EventCategory.FACULTY,
        points: 5,
        description: "Workshop Attendance",
        date: recentDates[4], // 25 days ago
      },
      {
        studentId: "1",
        eventId: "event_006",
        category: EventCategory.UNIVERSITY,
        points: 15,
        description: "Research Paper Publication",
        date: recentDates[5], // 40 days ago (not recent)
      },
      {
        studentId: "2", // Sarah
        eventId: "event_007",
        category: EventCategory.UNIVERSITY,
        points: 20,
        description: "National Science Fair",
        date: recentDates[0],
      },
      {
        studentId: "2",
        eventId: "event_008",
        category: EventCategory.FACULTY,
        points: 10,
        description: "Engineering Design Contest",
        date: recentDates[2],
      },
      {
        studentId: "3", // Raj
        eventId: "event_009",
        category: EventCategory.FACULTY,
        points: 8,
        description: "IoT Innovation Workshop",
        date: recentDates[1],
      },
      {
        studentId: "3",
        eventId: "event_010",
        category: EventCategory.COLLEGE,
        points: 12,
        description: "Debate Competition",
        date: recentDates[3],
      },
    ];

    sampleMerits.forEach((merit, index) => {
      meritRecords.push({
        id: `sample_merit_${index + 1}`,
        ...merit,
      });
    });
  }

  /**
   * Get overall system statistics
   */
  static getSystemStats() {
    const allMeritRecords = this.generateMeritRecords();

    return {
      totalEvents: events.length,
      totalStudents: students.length,
      totalRegistrations: registrations.length,
      totalMeritRecords: allMeritRecords.length,
      totalPointsAwarded: allMeritRecords.reduce(
        (sum: number, record: MeritRecord) => sum + record.points,
        0
      ),
      averagePointsPerStudent:
        allMeritRecords.reduce(
          (sum: number, record: MeritRecord) => sum + record.points,
          0
        ) / students.length,
    };
  }
}

export default DataService;
