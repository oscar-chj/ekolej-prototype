"use server";

import { meritService } from "@/lib/services/meritService";
import { revalidatePath } from "next/cache";
import { CreateMeritRecordRequest } from "@/types/merit.types";

export interface MeritUploadEntry extends Omit<CreateMeritRecordRequest, "date"> {
    meritType?: string;
}

export async function uploadMeritAction(entries: MeritUploadEntry[], eventId?: string) {
    const result = await meritService.uploadMerits(entries, eventId);

    if (result.success) {
        revalidatePath("/admin/merits");
        revalidatePath("/leaderboard");
        revalidatePath("/dashboard");
    }

    return result;
}

export async function getStudentMeritSummaryAction(studentId: string) {
    return await meritService.getMeritSummary(studentId);
}
