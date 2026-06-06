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

  // 4. Log notification to DB (feeds Cai Yun's notification log UI)
  await prisma.notification.create({
    data: {
      userId,
      type,
      message: template.subject,
      status: result.success ? 'SENT' : 'FAILED',
    },
  });

  return result;
}
