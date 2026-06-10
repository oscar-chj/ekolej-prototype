"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { getStudentRankAction } from "@/app/actions/leaderboardActions";

interface CurrentUserRankingProps {
    currentUserEmail: string;
    sortBy: "total" | "university" | "faculty" | "college" | "club";
    isStudent: boolean;
}

export function CurrentUserRanking({
    currentUserEmail,
    sortBy,
    isStudent,
}: CurrentUserRankingProps) {
    const [ranking, setRanking] = useState<{
        rank: number;
        points: number;
        total: number;
    } | null>(null);

    useEffect(() => {
        if (!isStudent) return;

        const fetchRanking = async () => {
            try {
                const result = await getStudentRankAction(currentUserEmail);
                if (result.success && result.data) {
                    setRanking({
                        rank: result.data.rank,
                        points: result.data.totalPoints,
                        total: 100,
                    });
                }
            } catch (error) {
                console.error("Error fetching user ranking:", error);
            }
        };

        fetchRanking();
    }, [currentUserEmail, sortBy, isStudent]);

    if (!isStudent || !ranking) return null;

    const categoryNames = {
        total: "Overall",
        university: "University Merit",
        faculty: "Faculty Merit",
        college: "College Merit",
        club: "Club Merit",
    };

    return (
        <Card sx={{ mb: 3, bgcolor: "primary.main", color: "white" }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Your {categoryNames[sortBy]} Ranking
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box>
                        <Typography variant="h3" fontWeight="bold">#{ranking.rank}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Overall</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">{ranking.points}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>points earned</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
