// Example: Using the user store in any component

"use client";

import { useUserInfo } from "@/hooks/useUserProfile";
import { Typography, Box } from "@mui/material";

export default function UserInfo() {
  const { student, meritSummary } = useUserInfo();

  if (!student) {
    return <Typography>Loading user info...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">{student.name}</Typography>
      <Typography variant="body2">
        Total Points: {meritSummary?.totalPoints || 0}
      </Typography>
    </Box>
  );
}
