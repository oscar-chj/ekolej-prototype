import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/lib/services/eventService";
import { EventCategory, EventStatus } from "@/types/api.types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category") as EventCategory | undefined;
    const status = searchParams.get("status") as EventStatus | undefined;
    const search = searchParams.get("search") || undefined;

    const result = await eventService.getEvents({ page, limit }, { category, status, search });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
