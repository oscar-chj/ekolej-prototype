"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function LeaderboardPage() {
  return (
    <DashboardLayout title="Merit Leaderboard">
      <Leaderboard />
    </DashboardLayout>
  );
}
