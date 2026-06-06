import { prisma } from '@/lib/prisma';
import { sendEmail } from './emailService';
import { getEmailTemplate, NotificationType } from './emailTemplates';

interface NotifyUserInput {
  userId: string;
  type: NotificationType;
  payload: {
    points?: number;
    category?: string;
    eventName?: string;
    eventDate?: string;
  };
}

export async function notifyUser({ userId, type, payload }: NotifyUserInput) {
  // 1. Fetch user from DB
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.email) {
    console.warn(`[notificationService] No email found for user ${userId}`);
    return { success: false, error: 'User email not found' };
  }

  // 2. Build email from template
  const template = getEmailTemplate(type, {
    userName: user.name ?? 'Student',
    ...payload,
  });

  // 3. Send email
  const result = await sendEmail({ to: user.email, ...template });

  // 4. Log to EmailLog table (matches Cai Yun's UI)
  await prisma.emailLog.create({
    data: {
      recipient: user.email,
      status: result ? 'SENT' : 'FAILED',
      description: template.subject,
    },
  });

  return result;
}