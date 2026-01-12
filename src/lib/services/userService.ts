import { prisma } from "../../../prisma/prisma";

export class UserService {
    async getCurrentUser(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) return { success: false, error: "User not found" };

            return { success: true, data: user };
        } catch (error) {
            console.error("Error fetching current user:", error);
            return { success: false, error: "Failed to fetch user data" };
        }
    }

    async getStudentById(studentId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { studentId },
            });

            if (!user) return { success: false, error: "Student not found" };

            return { success: true, data: user };
        } catch (error) {
            console.error("Error fetching student by ID:", error);
            return { success: false, error: "Failed to fetch student data" };
        }
    }
}

export const userService = new UserService();
