//src/app/actions/amail.Actions
"use server"; 
import { prisma } from "../../../prisma/prisma";
import { emailLogService } from "@/services/email/emailLogService";
import { emailService } from "@/services/email/emailService";

export async function sendEmailAction(to: string, subject: string, body: string) {
  return await emailService.sendEmail(to, subject, body);
}

export async function fetchLogsAction(status?: string, search?: string, page: number = 1) {
  const pageSize = 10;
  return await prisma.emailLog.findMany({
    where: {
      status: status !== "All Statuses" ? status : undefined,
      recipient: { contains: search || '', mode: 'insensitive' }
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export async function countLogsAction(status?: string, search?: string) {
  return await prisma.emailLog.count({
    where: {
      status: status !== "All Statuses" ? status : undefined,
      recipient: { contains: search || '', mode: 'insensitive' }
    }
  });
}