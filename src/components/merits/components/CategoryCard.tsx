"use client";

import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { getCategoryColor, getCategoryDisplayName } from "@/lib/categoryUtils";
import { EventCategory } from "@/types/api.types";

interface CategoryCardProps {
    category: EventCategory;
    points: number;
    targetPoints: number;
}

export function CategoryCard({ category, points, targetPoints }: CategoryCardProps) {
    const percentage = Math.min((points / targetPoints) * 100, 100);
    const isCompleted = points >= targetPoints;

    return (
        <Card
            sx={{
                height: "100%",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 1,
                },
            }}
        >
            <CardContent sx={{ p: 3, height: "100%" }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" component="h3" sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}>
                        {getCategoryDisplayName(category)}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <CircularProgress
                            variant="determinate"
                            value={percentage}
                            size={60}
                            thickness={4}
                            sx={{ color: getCategoryColor(category) }}
                        />
                        <Box
                            sx={{
                                position: "absolute", top: 0, left: 0, bottom: 0, right: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <Typography variant="body2" component="div" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                                {Math.round(percentage)}%
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.75rem", lineHeight: 1, mb: 0.5 }}>
                            {points}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                            of {targetPoints} points
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{ color: isCompleted ? "success.main" : "text.secondary", fontSize: "0.875rem", fontWeight: 500 }}
                >
                    {isCompleted
                        ? `Target achieved${points > targetPoints ? ` (+${points - targetPoints})` : ""}`
                        : `${targetPoints - points} points remaining`}
                </Typography>
            </CardContent>
        </Card>
    );
}
