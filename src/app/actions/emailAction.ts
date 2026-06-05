//src/app/actions/amail.Actions
"use server"; 

import { emailLogService } from "@/services/email/emailLogService";
import { emailService } from "@/services/email/emailService";

export async function sendEmailAction(to: string, subject: string, body: string) {
  return await emailService.sendEmail(to, subject, body);
}

export async function fetchLogsAction() {
  return await emailLogService.fetchLogs();
}