import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { meritService } from "@/lib/services/meritService";
import { prisma } from "../../../../../prisma/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const studentIdParam = searchParams.get("studentId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let studentId = studentIdParam;
    if (!studentId) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
      studentId = user.id;
    }

    const result = await meritService.getStudentMerits(studentId, page, limit);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/merits/records:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch merit records" },
      { status: 500 }
    );
  }
}
