"use client";

import { useEffect, useState, useRef } from "react";
import { Avatar, Box, Card, CardContent, Chip, Skeleton, Typography } from "@mui/material";
import { getLeaderboardAction } from "@/app/actions/leaderboardActions";
import { LeaderboardEntry, getRankColor } from "./LeaderboardTable";

export function TopThreePodium({ currentUserEmail = "" }: { currentUserEmail?: string }) {
    const [top3, setTop3] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const cacheRef = useRef<LeaderboardEntry[] | null>(null);

    useEffect(() => {
        const fetchTop3 = async () => {
            if (cacheRef.current) {
                setTop3(cacheRef.current);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const result = await getLeaderboardAction("total");
                if (result.success && result.data) {
                    const top3Data = (result.data as LeaderboardEntry[]).slice(0, 3);
                    cacheRef.current = top3Data;
                    setTop3(top3Data);
                }
            } catch (error) {
                console.error("Error fetching top 3:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTop3();
    }, []);

    if (isLoading) return renderPodiumSkeleton();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">🏆 Top Performers</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                {top3.map((student, index) => {
                    const isCurrentUser = student.email === currentUserEmail;
                    return (
                        <Card
                            key={student.id}
                            sx={{
                                maxWidth: 300, textAlign: "center", position: "relative",
                                border: "2px solid #FFD700",
                                ...(isCurrentUser && { boxShadow: "0 0 20px rgba(25, 118, 210, 0.4)", border: "2px solid", borderColor: "primary.main" }),
                            }}
                        >
                            <CardContent>
                                {index === 0 && <Box sx={{ position: "absolute", top: -8, right: 0 }}><Typography fontSize="2rem">👑</Typography></Box>}
                                {isCurrentUser && <Box sx={{ position: "absolute", top: 8, left: 8 }}><Chip label="You!" size="small" color="primary" /></Box>}
                                <Avatar
                                    sx={{ width: 64, height: 64, mx: "auto", mb: 2, bgcolor: getRankColor(index + 1) }}
                                >{student.name.charAt(0)}</Avatar>
                                <Typography variant="h6" fontWeight="bold" noWrap>{student.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                                    {student.faculty} • Year {student.year ?? 1}
                                </Typography>
                                <Typography variant="h4" color="primary" fontWeight="bold">{student.totalPoints}</Typography>
                                <Typography variant="caption" color="text.secondary">Total Points</Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>
        </Box>
    );
}

function renderPodiumSkeleton() {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">🏆 Top Performers</Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                {[...Array(3)].map((_, index) => (
                    <Card key={index} sx={{ minWidth: 200, textAlign: "center", border: "2px solid #FFD700" }}>
                        <CardContent>
                            <Skeleton variant="circular" width={64} height={64} sx={{ mx: "auto", mb: 2 }} />
                            <Skeleton width="60%" sx={{ mx: "auto", mb: 1 }} />
                            <Skeleton width="80%" sx={{ mx: "auto", mb: 2 }} />
                            <Skeleton width={60} height={40} sx={{ mx: "auto" }} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
