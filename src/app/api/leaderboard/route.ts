import { NextRequest, NextResponse } from "next/server";
import { leaderboardService } from "@/lib/services/leaderboardService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = (searchParams.get("sortBy") || "total") as "total" | "university" | "faculty" | "college" | "club";

    const result = await leaderboardService.getLeaderboard(sortBy);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
