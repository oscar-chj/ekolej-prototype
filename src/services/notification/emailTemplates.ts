export type NotificationType = 'MERIT_ADDED' | 'EVENT_REMINDER' | 'REGISTRATION_CONFIRMED';

interface TemplateData {
  userName: string;
  points?: number;
  category?: string;
  eventName?: string;
  eventDate?: string;
}

export function getEmailTemplate(
  type: NotificationType,
  data: TemplateData
): { subject: string; html: string } {
  switch (type) {
    case 'MERIT_ADDED':
      return {
        subject: 'Merit Points Updated',
        html: `<p>Hi ${data.userName}, you have received ${data.points} merit points for <strong>${data.category}</strong>.</p>`,
      };
    case 'EVENT_REMINDER':
      return {
        subject: `Event Reminder: ${data.eventName}`,
        html: `<p>Hi ${data.userName}, this is a reminder for <strong>${data.eventName}</strong> on ${data.eventDate}.</p>`,
      };
    case 'REGISTRATION_CONFIRMED':
      return {
        subject: `Event Registration Confirmed: ${data.eventName}`,
        html: `<p>Hi ${data.userName}, your registration for <strong>${data.eventName}</strong> is confirmed.</p>`,
      };
  }
}
