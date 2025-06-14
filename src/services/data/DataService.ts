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
      associationMerit: 0,
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
        case EventCategory.ASSOCIATION:
          summary.associationMerit += record.points;
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
    sortBy:
      | "total"
      | "university"
      | "faculty"
      | "college"
      | "association" = "total"
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
        associationMerit: 0,
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
          case EventCategory.ASSOCIATION:
            data.associationMerit += record.points;
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
      case "association":
        return leaderboardData.sort(
          (a, b) => b.associationMerit - a.associationMerit
        );
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
    );    // Get upcoming events (all upcoming events, not just registered ones)
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

  // ===== HELPER METHODS =====
  /**
   * Add sample merit records for demonstration
   */
  private static addSampleMeritRecords(meritRecords: MeritRecord[]): void {
    const sampleMerits: Omit<MeritRecord, "id">[] = [
      {
        studentId: "1", // Ahmad
        eventId: "sample_001",
        category: EventCategory.UNIVERSITY,
        points: 15,
        description: "International Programming Competition",
        date: "2025-04-15",
      },
      {
        studentId: "1",
        eventId: "sample_002",
        category: EventCategory.FACULTY,
        points: 12,
        description: "AI Research Presentation",
        date: "2025-04-20",
      },
      {
        studentId: "2", // Sarah
        eventId: "sample_003",
        category: EventCategory.UNIVERSITY,
        points: 20,
        description: "National Science Fair",
        date: "2025-04-10",
      },
      {
        studentId: "3", // Raj
        eventId: "sample_004",
        category: EventCategory.FACULTY,
        points: 8,
        description: "IoT Innovation Workshop",
        date: "2025-04-18",
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
