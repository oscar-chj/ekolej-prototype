"use server";

import { leaderboardService } from "@/lib/services/leaderboardService";

export async function getLeaderboardAction(sortBy: 'total' | 'university' | 'faculty' | 'college' | 'club' = 'total') {
    return await leaderboardService.getLeaderboard(sortBy);
}

export async function getStudentRankAction(email: string) {
    return await leaderboardService.getStudentRankByEmail(email);
}
