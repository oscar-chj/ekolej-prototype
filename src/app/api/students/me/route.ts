import { auth } from "@/auth";
import { userService } from "@/lib/services/userService";
import { NextResponse } from "next/server";
import { UserRole } from "@/types/api.types";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const result = await userService.getCurrentUser(session.user.email);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    const user = result.data;
    if (!user) {
      return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
    }

    const userData = {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      emailVerified: user.emailVerified ?? false,
      image: user.image,
      role: (user.role as UserRole) ?? UserRole.STUDENT,
      studentId: user.studentId ?? user.email.split("@")[0],
      faculty: user.faculty ?? "",
      year: user.year ?? 1,
      program: user.program ?? "",
      totalMeritPoints: user.totalMeritPoints,
      enrollmentDate: user.enrollmentDate ?? user.createdAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error in GET /api/students/me:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
}
