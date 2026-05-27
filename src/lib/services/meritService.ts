import { prisma } from "../../../prisma/prisma";
import { EventCategory } from "@/types/api.types";
import { MeritUploadEntry } from "@/app/actions/meritActions";
import { eventBroker } from "../events";
import { ActivityAction } from "../../../generated/prisma/client";

export class MeritService {
    async getStudentMerits(studentId: string, page: number = 1, limit: number = 50) {
        try {
            const skip = (page - 1) * limit;
            const take = limit;

            const total = await prisma.meritRecord.count({ where: { studentId } });
            const merits = await prisma.meritRecord.findMany({
                where: { studentId },
                orderBy: { date: "desc" },
                skip,
                take,
                include: {
                    event: {
                        select: { title: true }
                    }
                }
            });

            return {
                success: true,
                data: merits,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    itemsPerPage: limit,
                }
            };
        } catch (error) {
            console.error("Error fetching student merits:", error);
            return { success: false, error: "Failed to fetch merits" };
        }
    }

    async uploadMerits(entries: MeritUploadEntry[], eventId?: string) {
        try {
            // Keep track of email payloads to send after successful transaction
            const emailNotifications: Array<{
                studentId: string;
                email: string;
                name: string;
                points: number;
                category: EventCategory;
                description: string;
                newTotal: number;
            }> = [];

            // Logic for bulk creating merit records and updating student totals
            const result = await prisma.$transaction(async (tx) => {
                const records = await Promise.all(
                    entries.map(async (entry) => {
                        const student = await tx.user.findUnique({
                            where: { studentId: entry.studentId },
                            select: { id: true, name: true, email: true, totalMeritPoints: true }
                        });

                        if (!student) throw new Error(`Student ${entry.studentId} not found`);

                        const category = (entry.category as EventCategory) || EventCategory.UNIVERSITY;
                        const points = entry.points;
                        const description = entry.description || "Event Merit";

                        // Create merit record
                        const record = await tx.meritRecord.create({
                            data: {
                                studentId: student.id,
                                eventId: eventId,
                                category,
                                points,
                                description,
                                date: new Date(),
                                meritType: entry.meritType,
                            },
                        });

                        const updatedTotal = student.totalMeritPoints + points;

                        // Update student total
                        await tx.user.update({
                            where: { id: student.id },
                            data: {
                                totalMeritPoints: {
                                    increment: points
                                }
                            }
                        });

                        if (student.email) {
                            emailNotifications.push({
                                studentId: student.id,
                                email: student.email,
                                name: student.name || "Student",
                                points,
                                category,
                                description,
                                newTotal: updatedTotal,
                            });
                        }

                        return record;
                    })
                );
                return records;
            });

            // Trigger notification events asynchronously after transaction succeeds
            for (const notification of emailNotifications) {
                eventBroker.emit(ActivityAction.MERIT_ADDED, {
                    actorId: "system",
                    studentId: notification.studentId,
                    points: notification.points,
                    category: notification.category as string,
                    description: notification.description,
                    newTotal: notification.newTotal,
                    eventId: eventId || undefined,
                });
            }

            return { success: true, data: result };
        } catch (error) {
            console.error("Error uploading merits:", error);
            return { success: false, error: error instanceof Error ? error.message : "Failed to upload merits" };
        }
    }

    async getMeritSummary(studentId: string) {
        try {
            const meritRecords = await prisma.meritRecord.findMany({
                where: { studentId },
                include: { event: true },
                orderBy: { date: "desc" },
            });

            const summary = {
                totalPoints: 0,
                universityMerit: 0,
                facultyMerit: 0,
                collegeMerit: 0,
                clubMerit: 0,
                recentActivities: 0,
                rank: 1,
                totalStudents: 0,
                targetPoints: 50,
                progressPercentage: 0,
                targetAchieved: false,
                remainingPoints: 0,
                exceededPoints: 0,
            };

            meritRecords.forEach((record) => {
                summary.totalPoints += record.points;
                const category = record.category as string;
                switch (category) {
                    case "UNIVERSITY": summary.universityMerit += record.points; break;
                    case "FACULTY": summary.facultyMerit += record.points; break;
                    case "COLLEGE": summary.collegeMerit += record.points; break;
                    case "CLUB": summary.clubMerit += record.points; break;
                }
            });

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            summary.recentActivities = meritRecords.filter(
                (record) => new Date(record.date) > thirtyDaysAgo
            ).length;

            summary.progressPercentage = Math.min(Math.round((summary.totalPoints / summary.targetPoints) * 100), 100);
            summary.targetAchieved = summary.totalPoints >= summary.targetPoints;
            summary.remainingPoints = summary.targetAchieved ? 0 : summary.targetPoints - summary.totalPoints;
            summary.exceededPoints = summary.targetAchieved ? summary.totalPoints - summary.targetPoints : 0;

            // Calculate rank (This could be optimized)
            const allStudents = await prisma.user.findMany({
                where: { role: "STUDENT" },
                select: { id: true, totalMeritPoints: true }
            });

            const sortedStudents = allStudents.sort((a, b) => b.totalMeritPoints - a.totalMeritPoints);
            summary.totalStudents = sortedStudents.length;
            summary.rank = sortedStudents.findIndex((s) => s.id === studentId) + 1 || 1;

            return { success: true, data: summary };
        } catch (error) {
            console.error("Error getting merit summary:", error);
            return { success: false, error: "Failed to get merit summary" };
        }
    }
}

export const meritService = new MeritService();
