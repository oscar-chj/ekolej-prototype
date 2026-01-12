import { prisma } from "../../../prisma/prisma";
import { Event, EventCategory, EventStatus } from "@/types/api.types";

export class EventService {
    async getEvents(
        pagination: { page: number; limit: number },
        filters?: { category?: EventCategory; status?: EventStatus; search?: string }
    ) {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const where: any = {};

            if (filters?.category) where.category = filters.category;
            if (filters?.status) where.status = filters.status;
            if (filters?.search) {
                where.OR = [
                    { title: { contains: filters.search, mode: "insensitive" } },
                    { description: { contains: filters.search, mode: "insensitive" } },
                    { location: { contains: filters.search, mode: "insensitive" } },
                ];
            }

            const [total, events] = await Promise.all([
                prisma.event.count({ where }),
                prisma.event.findMany({
                    where,
                    orderBy: { date: "asc" },
                    skip,
                    take: limit,
                    include: {
                        _count: {
                            select: { registrations: true },
                        },
                    },
                }),
            ]);

            const transformedEvents: Event[] = events.map((event) => ({
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                organizer: event.organizer,
                category: event.category as EventCategory,
                points: event.points,
                capacity: event.capacity,
                registeredCount: event._count.registrations,
                status: event.status as EventStatus,
                imageUrl: event.imageUrl,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            }));

            return {
                success: true,
                data: transformedEvents,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } catch (error) {
            console.error("Error in EventService.getEvents:", error);
            return { success: false, error: "Failed to fetch events" };
        }
    }

    async getEventById(id: string) {
        try {
            const event = await prisma.event.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { registrations: true },
                    },
                },
            });

            if (!event) return { success: false, error: "Event not found" };

            const transformedEvent: Event = {
                id: event.id,
                title: event.title,
                description: event.description,
                date: event.date,
                time: event.time,
                location: event.location,
                organizer: event.organizer,
                category: event.category as EventCategory,
                points: event.points,
                capacity: event.capacity,
                registeredCount: event._count.registrations,
                status: event.status as EventStatus,
                imageUrl: event.imageUrl,
                createdAt: event.createdAt,
                updatedAt: event.updatedAt,
            };

            return { success: true, data: transformedEvent };
        } catch (error) {
            console.error("Error in EventService.getEventById:", error);
            return { success: false, error: "Failed to fetch event" };
        }
    }

    async getEventRegistrations(eventId: string, pagination: { page: number; limit: number }) {
        try {
            const { page, limit } = pagination;
            const skip = (page - 1) * limit;

            const [total, registrations] = await Promise.all([
                prisma.eventRegistration.count({ where: { eventId } }),
                prisma.eventRegistration.findMany({
                    where: { eventId },
                    skip,
                    take: limit,
                    orderBy: { registrationDate: "asc" },
                }),
            ]);

            return {
                success: true,
                data: registrations,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } catch (error) {
            console.error("Error in EventService.getEventRegistrations:", error);
            return { success: false, error: "Failed to fetch registrations" };
        }
    }

    async registerForEvent(eventId: string, userId: string) {
        try {
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: {
                    _count: {
                        select: {
                            registrations: {
                                where: { status: "REGISTERED" },
                            },
                        },
                    },
                },
            });

            if (!event) return { success: false, error: "Event not found" };

            const existingRegistration = await prisma.eventRegistration.findUnique({
                where: {
                    eventId_studentId: { eventId, studentId: userId },
                },
            });

            if (existingRegistration) return { success: false, error: "Already registered" };

            const registrationStatus = event._count.registrations < event.capacity ? "REGISTERED" : "WAITLISTED";

            const registration = await prisma.eventRegistration.create({
                data: { eventId, studentId: userId, status: registrationStatus },
            });

            return { success: true, data: registration };
        } catch (error) {
            console.error("Error in registerForEvent:", error);
            return { success: false, error: "Failed to register" };
        }
    }

    async cancelRegistration(eventId: string, userId: string) {
        try {
            const registration = await prisma.eventRegistration.findUnique({
                where: { eventId_studentId: { eventId, studentId: userId } },
            });

            if (!registration) return { success: false, error: "Registration not found" };
            if (registration.status === "ATTENDED") return { success: false, error: "Cannot cancel after attendance marked" };

            await prisma.eventRegistration.delete({ where: { id: registration.id } });

            // Handle waitlist
            if (registration.status === "REGISTERED") {
                const nextInWaitlist = await prisma.eventRegistration.findFirst({
                    where: { eventId, status: "WAITLISTED" },
                    orderBy: { registrationDate: "asc" },
                });

                if (nextInWaitlist) {
                    await prisma.eventRegistration.update({
                        where: { id: nextInWaitlist.id },
                        data: { status: "REGISTERED" },
                    });
                }
            }

            return { success: true };
        } catch (error) {
            console.error("Error in cancelRegistration:", error);
            return { success: false, error: "Failed to cancel" };
        }
    }
}

export const eventService = new EventService();
