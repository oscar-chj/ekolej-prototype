"use client";

import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

interface OverallSummaryProps {
    totalPoints: number;
    rank: number;
    totalStudents: number;
    progressPercentage: number;
    targetAchieved: boolean;
    exceededPoints: number;
    remainingPoints: number;
}

export function OverallSummary({
    totalPoints,
    rank,
    totalStudents,
    progressPercentage,
    targetAchieved,
    exceededPoints,
    remainingPoints,
}: OverallSummaryProps) {
    return (
        <Card
            sx={{
                mb: 4,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.25)",
            }}
        >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "center", sm: "flex-start" }, gap: 4 }}>
                    <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                        <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: "3.5rem", md: "4rem" }, lineHeight: 0.9, mb: 1, background: "linear-gradient(45deg, #fff 0%, rgba(255,255,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {totalPoints}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, opacity: 0.95 }}>Merit Points Earned</Typography>
                        <Box sx={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, p: 2, border: "1px solid rgba(255,255,255,0.2)" }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {targetAchieved
                                    ? exceededPoints > 0
                                        ? `Outstanding! You've exceeded your goal by ${exceededPoints} points.`
                                        : "Congratulations! You've reached your merit goal."
                                    : `You're ${Math.round(progressPercentage)}% of the way to your goal.`}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: { xs: "center", sm: "right" }, display: "flex", flexDirection: "column", alignItems: { xs: "center", sm: "flex-end" }, gap: 2, minWidth: { sm: 200 } }}>
                        <Box>
                            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2.5rem", md: "2.5rem" }, lineHeight: 1, mb: 0.5 }}>#{rank}</Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>out of {totalStudents} students</Typography>
                        </Box>
                        <Chip
                            label={targetAchieved ? (exceededPoints > 0 ? `+${exceededPoints} bonus points` : "Goal achieved") : `${remainingPoints} to goal`}
                            sx={{
                                backgroundColor: targetAchieved ? "#4caf50" : "#fff",
                                color: targetAchieved ? "#fff" : "#1976d2",
                                fontWeight: 700, borderRadius: 2, boxShadow: 1, border: targetAchieved ? "none" : "2px solid rgba(255,255,255,0.3)",
                            }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
