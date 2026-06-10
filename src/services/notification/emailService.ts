import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  const { error } = await resend.emails.send({
    from: 'SMMS <onboarding@resend.dev>',
    ...payload,
  });

  if (error) {
    console.error('[emailService] Failed to send email:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
