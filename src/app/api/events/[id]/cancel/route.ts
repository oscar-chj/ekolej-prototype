import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { eventService } from "@/lib/services/eventService";
import { prisma } from "../../../../../../prisma/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: eventId } = await params;

    // Find internal user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const result = await eventService.cancelRegistration(eventId, user.id);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /api/events/[id]/cancel:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel registration" },
      { status: 500 }
    );
  }
}
