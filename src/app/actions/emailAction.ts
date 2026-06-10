'use server';

import { sendEmail } from '@/services/notification/emailService';
import { prisma } from '@/lib/prisma';

export async function sendEmailAction(recipient: string, subject: string, body: string) {
  const result = await sendEmail({ to: recipient, subject, html: body });

  await prisma.emailLog.create({
    data: {
      recipient,
      subject,
      description: subject,
      status: result.success ? 'SENT' : 'FAILED',
    },
  });

  return result;
}

export async function resendEmailAction(logId: string) {
  const log = await prisma.emailLog.findUnique({ where: { id: logId } });
  if (!log) return { success: false, error: 'Log not found' };

  const result = await sendEmail({
    to: log.recipient,
    subject: `[Resent] ${log.subject}`,
    html: `<p>This is a resent notification: <strong>${log.description}</strong></p>`,
  });

  await prisma.emailLog.create({
    data: {
      recipient: log.recipient,
      subject: `[Resent] ${log.subject}`,
      description: log.description,
      status: result.success ? 'SENT' : 'FAILED',
    },
  });

  return result;
}

export async function fetchLogsAction() {
  return await prisma.emailLog.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
