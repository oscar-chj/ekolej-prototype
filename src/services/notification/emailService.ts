import nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'noreply@smms.dev',
      ...payload,
    });
    return { success: true };
  } catch (error) {
    console.error('[emailService] Failed to send email:', error);
    return { success: false, error: String(error) };
  }
}
