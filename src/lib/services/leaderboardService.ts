import { prisma } from "../../../prisma/prisma";

export class LeaderboardService {
    async getLeaderboard(sortBy: 'total' | 'university' | 'faculty' | 'college' | 'club' = 'total', limit: number = 100) {
        try {
            // Logic for fetching students and their merit distribution
            // This is a simplified version, in a real app we might want to pre-calculate or use a view
            const students = await prisma.user.findMany({
                where: { role: 'STUDENT' },
                orderBy: {
                    totalMeritPoints: 'desc'
                },
                take: limit,
                select: {
                    id: true,
                    studentId: true,
                    name: true,
                    faculty: true,
                    year: true,
                    totalMeritPoints: true,
                    meritRecords: {
                        select: {
                            category: true,
                            points: true
                        }
                    }
                }
            });

            const leaderboard = students.map(student => {
                const categories = {
                    university: 0,
                    faculty: 0,
                    college: 0,
                    club: 0
                };

                student.meritRecords.forEach(record => {
                    const cat = record.category.toLowerCase() as keyof typeof categories;
                    if (categories[cat] !== undefined) {
                        categories[cat] += record.points;
                    }
                });

                return {
                    id: student.id,
                    studentId: student.studentId,
                    name: student.name,
                    faculty: student.faculty,
                    year: student.year,
                    totalPoints: student.totalMeritPoints,
                    universityMerit: categories.university,
                    facultyMerit: categories.faculty,
                    collegeMerit: categories.college,
                    clubMerit: categories.club
                };
            });

            // Sort by the specific category if requested
            if (sortBy !== 'total') {
                const key = `${sortBy}Merit` as keyof typeof leaderboard[0];
                leaderboard.sort((a, b) => (b[key] as number) - (a[key] as number));
            }

            return { success: true, data: leaderboard };
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return { success: false, error: "Failed to fetch leaderboard" };
        }
    }

    async getStudentRank(studentId: string) {
        try {
            // Count students with more points than this one
            const student = await prisma.user.findUnique({
                where: { id: studentId },
                select: { totalMeritPoints: true }
            });

            if (!student) return { success: false, error: "Student not found" };

            const rank = await prisma.user.count({
                where: {
                    role: 'STUDENT',
                    totalMeritPoints: {
                        gt: student.totalMeritPoints
                    }
                }
            });

            return { success: true, data: { rank: rank + 1, totalPoints: student.totalMeritPoints } };
        } catch (error) {
            console.error("Error fetching student rank:", error);
            return { success: false, error: "Failed to fetch student rank" };
        }
    }
}

export const leaderboardService = new LeaderboardService();
