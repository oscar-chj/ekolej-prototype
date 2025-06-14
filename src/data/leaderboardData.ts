/**
 * Sample leaderboard data for development and testing
 * In production, this would come from a database query
 */

// Leaderboard entry interface
export interface LeaderboardEntry {
  id: string;
  name: string;
  studentId: string;
  faculty: string;
  year: string;
  totalPoints: number;
  universityMerit: number;
  facultyMerit: number;
  collegeMerit: number;
  associationMerit: number;
  rank: number;
  avatar?: string;
}

export const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    studentId: 'S12001',
    faculty: 'Computer Science',
    year: '4',
    totalPoints: 285,
    universityMerit: 120,
    facultyMerit: 85,
    collegeMerit: 50,
    associationMerit: 30,
    rank: 1,
  },
  {
    id: '2', 
    name: 'Bob Chen',
    studentId: 'S12002',
    faculty: 'Engineering',
    year: '3',
    totalPoints: 245,
    universityMerit: 80,
    facultyMerit: 95,
    collegeMerit: 40,
    associationMerit: 30,
    rank: 2,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    studentId: 'S12003',
    faculty: 'Business',
    year: '2',
    totalPoints: 220,
    universityMerit: 70,
    facultyMerit: 75,
    collegeMerit: 45,
    associationMerit: 30,
    rank: 3,
  },
  {
    id: '4',
    name: 'Diana Zhang',
    studentId: 'S12004',
    faculty: 'Mathematics',
    year: '3',
    totalPoints: 195,
    universityMerit: 60,
    facultyMerit: 70,
    collegeMerit: 35,
    associationMerit: 30,
    rank: 4,
  },
  {
    id: '5',
    name: 'Ethan Brown',
    studentId: 'S12005',
    faculty: 'Physics',
    year: '4',
    totalPoints: 180,
    universityMerit: 55,
    facultyMerit: 65,
    collegeMerit: 35,
    associationMerit: 25,
    rank: 5,
  },
  {
    id: '6',
    name: 'Fiona Wilson',
    studentId: 'S12006',
    faculty: 'Chemistry',
    year: '2',
    totalPoints: 165,
    universityMerit: 45,
    facultyMerit: 60,
    collegeMerit: 35,
    associationMerit: 25,
    rank: 6,
  },
  {
    id: '7',
    name: 'George Kim',
    studentId: 'S12007',
    faculty: 'Computer Science',
    year: '3',
    totalPoints: 155,
    universityMerit: 40,
    facultyMerit: 55,
    collegeMerit: 35,
    associationMerit: 25,
    rank: 7,
  },
  {
    id: '8',
    name: 'Hannah Lee',
    studentId: 'S12008',
    faculty: 'Engineering',
    year: '1',
    totalPoints: 145,
    universityMerit: 35,
    facultyMerit: 50,
    collegeMerit: 35,
    associationMerit: 25,
    rank: 8,
  },
  {
    id: '9',
    name: 'Ivan Martinez',
    studentId: 'S12009',
    faculty: 'Business',
    year: '4',
    totalPoints: 135,
    universityMerit: 30,
    facultyMerit: 45,
    collegeMerit: 35,
    associationMerit: 25,
    rank: 9,
  },
  {
    id: '10',
    name: 'John Doe',
    studentId: 'S12345',
    faculty: 'Computer Science',
    year: '2',
    totalPoints: 95,
    universityMerit: 35,
    facultyMerit: 25,
    collegeMerit: 20,
    associationMerit: 15,
    rank: 10,
  }
];

/**
 * Utility function to get leaderboard data sorted by specific category
 * This simulates what would be a database query in production
 */
export function getLeaderboardData(sortBy: 'total' | 'university' | 'faculty' | 'college' | 'association' = 'total'): LeaderboardEntry[] {
  const data = [...sampleLeaderboardData];
  
  switch (sortBy) {
    case 'university':
      return data.sort((a, b) => b.universityMerit - a.universityMerit);
    case 'faculty':
      return data.sort((a, b) => b.facultyMerit - a.facultyMerit);
    case 'college':
      return data.sort((a, b) => b.collegeMerit - a.collegeMerit);
    case 'association':
      return data.sort((a, b) => b.associationMerit - a.associationMerit);
    default:
      return data.sort((a, b) => b.totalPoints - a.totalPoints);
  }
}
