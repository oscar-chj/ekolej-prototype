"use server";

import { auth } from "@/auth";
import { eventService } from "@/lib/services/eventService";
import { prisma } from "../../../prisma/prisma";
import { revalidatePath } from "next/cache";

async function getUserId() {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    return user?.id || null;
}

export async function registerForEventAction(eventId: string) {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const result = await eventService.registerForEvent(eventId, userId);

    if (result.success) {
        revalidatePath(`/events/${eventId}`);
        revalidatePath("/events");
        revalidatePath("/dashboard");
    }

    return result;
}

export async function cancelRegistrationAction(eventId: string) {
    const userId = await getUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const result = await eventService.cancelRegistration(eventId, userId);

    if (result.success) {
        revalidatePath(`/events/${eventId}`);
        revalidatePath("/events");
        revalidatePath("/dashboard");
    }

    return result;
}
