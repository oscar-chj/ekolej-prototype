"use client";

import { Box, Paper, Typography } from "@mui/material";
import { CalendarToday, Assessment } from "@mui/icons-material";

interface StatsGridProps {
    recentActivities: number;
    progressPercentage: number;
}

export function StatsGrid({ recentActivities, progressPercentage }: StatsGridProps) {
    const statItems = [
        {
            label: "Recent Activities",
            value: recentActivities,
            icon: <CalendarToday color="primary" />,
            color: "primary.main",
        },
        {
            label: "Target Achievement",
            value: `${Math.round(progressPercentage)}%`,
            icon: <Assessment color="success" />,
            color: "success.main",
        },
    ];

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 3, mb: 4 }}>
            {statItems.map((item, index) => (
                <Paper
                    key={index}
                    sx={{
                        p: 3, textAlign: "center", borderRadius: 2, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-2px)", boxShadow: 2 },
                    }}
                >
                    {item.icon}
                    <Typography variant="h4" fontWeight="bold" sx={{ color: item.color, my: 1 }}>{item.value}</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{item.label}</Typography>
                </Paper>
            ))}
        </Box>
    );
}
