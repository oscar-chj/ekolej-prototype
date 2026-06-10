// send emails
//emailService
import { emailLogService } from "./emailLogService";

export const emailService = {
  sendEmail: async (to: string, subject: string, body: string) => {
    try {
      console.log(`[Mock Email] Sending to ${to}: ${subject}`);
      await emailLogService.createLog({
        recipient: to,
        status: 'Delivered',
        description: subject
      });
      return { success: true };
    } catch (error) {
      console.error("Email service error:", error);
      throw error;
    }
  }
};