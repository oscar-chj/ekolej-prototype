"use client";

import { useEffect, useState, useRef } from "react";
import {
    Avatar, Box, Chip, Divider, List, ListItem, Paper, Skeleton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import { getLeaderboardAction } from "@/app/actions/leaderboardActions";

export interface LeaderboardEntry {
    id: string;
    studentId: string;
    name: string;
    faculty: string;
    year: number;
    totalPoints: number;
    universityMerit: number;
    facultyMerit: number;
    collegeMerit: number;
    clubMerit: number;
}

interface LeaderboardTableProps {
    sortBy: "total" | "university" | "faculty" | "college" | "club";
    currentUserId?: string;
}

export function getRankColor(rank: number): string {
    switch (rank) {
        case 1: return "#FFD700"; // Gold
        case 2: return "#C0C0C0"; // Silver
        case 3: return "#CD7F32"; // Bronze
        default: return "#757575"; // Gray
    }
}

export function getRankIcon(rank: number): string {
    switch (rank) {
        case 1: return "🥇";
        case 2: return "🥈";
        case 3: return "🥉";
        default: return `#${rank}`;
    }
}

export function LeaderboardTable({
    sortBy,
    currentUserId = "1",
}: LeaderboardTableProps) {
    const cacheRef = useRef<Record<string, LeaderboardEntry[]>>({});
    const [sortedData, setSortedData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(() => !cacheRef.current[sortBy]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (cacheRef.current[sortBy]) {
                setSortedData(cacheRef.current[sortBy]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const result = await getLeaderboardAction(sortBy);
                if (result.success && result.data) {
                    cacheRef.current[sortBy] = result.data as LeaderboardEntry[];
                    setSortedData(result.data as LeaderboardEntry[]);
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [sortBy]);

    const displayData = sortedData.slice(0, 10);

    if (isLoading) {
        return isMobile ? renderMobileSkeleton() : renderDesktopSkeleton();
    }

    if (isMobile) {
        return (
            <Paper>
                <List sx={{ p: 0 }}>
                    {displayData.map((entry, index) => {
                        const actualIndex = sortedData.findIndex((item) => item.id === entry.id);
                        const displayRank = actualIndex + 1;
                        const isCurrentUser = entry.id === currentUserId;
                        const points = getPointsByCategory(entry, sortBy);

                        return (
                            <React.Fragment key={entry.id}>
                                <ListItem sx={{ py: 2, px: 2, ...(isCurrentUser && { bgcolor: "primary.lighter", borderLeft: "4px solid", borderColor: "primary.main" }) }}>
                                    <Box sx={{ display: "flex", width: "100%", alignItems: "center", gap: 2 }}>
                                        <Typography variant="h6" sx={{ color: getRankColor(displayRank), fontWeight: "bold", minWidth: 40 }}>
                                            {getRankIcon(displayRank)}
                                        </Typography>
                                        <Avatar sx={{ width: 40, height: 40, flexShrink: 0 }}>{entry.name.charAt(0)}</Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                <Typography variant="body2" fontWeight="bold" noWrap>{entry.name}</Typography>
                                                {isCurrentUser && <Chip label="You" size="small" color="primary" sx={{ height: 18 }} />}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" noWrap>{entry.faculty} • Year {entry.year ?? 1}</Typography>
                                        </Box>
                                        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ minWidth: 50, textAlign: "right" }}>
                                            {points}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                {index < displayData.length - 1 && <Divider />}
                            </React.Fragment>
                        );
                    })}
                </List>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: 80 }}>Rank</TableCell>
                        <TableCell sx={{ width: 220 }}>Student</TableCell>
                        <TableCell sx={{ width: 150 }}>Faculty</TableCell>
                        <TableCell sx={{ width: 100 }}>Year</TableCell>
                        <TableCell align="right" sx={{ width: 140 }}>
                            {getCategoryName(sortBy)}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayData.map((entry) => {
                        const actualIndex = sortedData.findIndex((item) => item.id === entry.id);
                        const displayRank = actualIndex + 1;
                        const isCurrentUser = entry.id === currentUserId;
                        const points = getPointsByCategory(entry, sortBy);

                        return (
                            <TableRow key={entry.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" }, ...(isCurrentUser && { border: "2px solid", borderColor: "primary.main" }) }}>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography variant="h6" sx={{ color: getRankColor(displayRank), fontWeight: "bold" }}>
                                            {getRankIcon(displayRank)}
                                        </Typography>
                                        {isCurrentUser && <Chip label="You" size="small" color="primary" />}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32 }}>{entry.name.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">{entry.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{entry.studentId}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{entry.faculty}</TableCell>
                                <TableCell><Chip label={`Year ${entry.year ?? 1}`} size="small" variant="outlined" /></TableCell>
                                <TableCell align="right">
                                    <Typography variant="h6" color="primary" fontWeight="bold">{points}</Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function getPointsByCategory(entry: LeaderboardEntry, category: string) {
    switch (category) {
        case "university": return entry.universityMerit;
        case "faculty": return entry.facultyMerit;
        case "college": return entry.collegeMerit;
        case "club": return entry.clubMerit;
        default: return entry.totalPoints;
    }
}

function getCategoryName(category: string) {
    const names: Record<string, string> = {
        total: "Total Points",
        university: "University Merit",
        faculty: "Faculty Merit",
        college: "College Merit",
        club: "Club Merit",
    };
    return names[category] || names.total;
}

function renderMobileSkeleton() {
    return (
        <Paper>
            <List sx={{ p: 0 }}>
                {[...Array(10)].map((_, index) => (
                    <Box key={index} sx={{ py: 2, px: 2, display: "flex", gap: 2, alignItems: "center" }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton width="60%" height={20} />
                            <Skeleton width="40%" height={16} />
                        </Box>
                        <Skeleton width={40} height={24} />
                    </Box>
                ))}
            </List>
        </Paper>
    );
}

function renderDesktopSkeleton() {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: 80 }}>Rank</TableCell>
                        <TableCell sx={{ width: 220 }}>Student</TableCell>
                        <TableCell sx={{ width: 150 }}>Faculty</TableCell>
                        <TableCell sx={{ width: 100 }}>Year</TableCell>
                        <TableCell align="right" sx={{ width: 140 }}>Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(10)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton variant="circular" width={32} height={32} /></TableCell>
                            <TableCell><Skeleton width="80%" /></TableCell>
                            <TableCell><Skeleton width="60%" /></TableCell>
                            <TableCell><Skeleton width={40} /></TableCell>
                            <TableCell align="right"><Skeleton width={40} sx={{ ml: "auto" }} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

import React from "react"; // for React.Fragment
