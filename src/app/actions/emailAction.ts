'use server';

import { sendEmail } from '@/services/notification/emailService';
import { prisma } from '@/lib/prisma';

export async function sendEmailAction(recipient: string, subject: string, body: string) {
  await sendEmail({ to: recipient, subject, html: body });

  await prisma.emailLog.create({
    data: {
      recipient,
      status: 'SENT',
      description: subject,
    },
  });
}

export async function fetchLogsAction() {
  return await prisma.emailLog.findMany({
    orderBy: { createdAt: 'desc' },
  });
}