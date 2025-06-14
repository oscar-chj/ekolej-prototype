/**
 * Data layer index - Central exports for all sample data
 * This file makes it easy to import sample data throughout the application
 * In production, these would be replaced with actual database queries
 */

// Main dashboard data
export { sampleMeritData } from './dashboardData';
export type { MeritSummary, MeritActivity, MeritEvent } from '../types/merit.types';

// Events data
export { events as sampleEvents } from './events';
export type { Event } from '../types/api.types';

// Students and users data
export { students as sampleStudents } from './students';
export { mockUsers as sampleUsers } from './mockUsers';

// Merit records
export { meritRecords as sampleMeritRecords } from './meritRecords';

// Navigation data
export { mainNavigationItems, sampleUserProfile } from './navigationData';
export type { NavigationItem } from './navigationData';

// Registration data
export { registrations as sampleRegistrations } from './registrations';

// Leaderboard data
export { sampleLeaderboardData, getLeaderboardData } from './leaderboardData';
export type { LeaderboardEntry } from './leaderboardData';

// Reports data
export { 
  sampleMeritRecords as reportMeritRecords, 
  filterRecordsByCategory,
  calculateCategoryTotal,
  getTotalMeritPoints,
  getRecentRecords,
  getRecordsByDateRange
} from './reportsData';
export type { MeritRecord as ReportMeritRecord } from './reportsData';

// Merits page data
export { sampleMeritSummary, getMeritInsights } from './meritsData';
export type { MeritSummaryData } from './meritsData';

// Admin data
export { 
  sampleEvent, 
  sampleCSVData, 
  availableEvents,
  processCSVData,
  validateStudentId,
  validatePoints,
  checkForDuplicates
} from './adminData';
export type { EventForMerit, CSVMeritEntry } from './adminData';

/**
 * Database Integration Notes:
 * 
 * When integrating with MongoDB/Firebase, replace these sample data exports with:
 * 
 * 1. Database connection utilities
 * 2. Schema definitions (for MongoDB) or document interfaces (for Firebase)
 * 3. CRUD operation functions
 * 4. Query builders and aggregation pipelines
 * 5. Real-time listeners (for Firebase)
 * 
 * Example structure for MongoDB integration:
 * - db/connection.ts - Database connection setup
 * - db/models/ - Mongoose schemas or document interfaces
 * - db/queries/ - Query functions replacing these sample data functions
 * - db/aggregations/ - Complex queries for leaderboards, reports, etc.
 * 
 * For Firebase:
 * - firebase/config.ts - Firebase setup
 * - firebase/collections.ts - Collection references
 * - firebase/queries.ts - Firestore query functions
 * - firebase/realtime.ts - Real-time listeners
 */
