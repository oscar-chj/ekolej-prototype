export type NotificationType =
  | 'MERIT_AWARDED'
  | 'EVENT_REGISTERED'
  | 'EVENT_REMINDER';

interface TemplateData {
  userName: string;
  points?: number;
  category?: string;
  eventName?: string;
  eventDate?: string;
}

export function getEmailTemplate(type: NotificationType, data: TemplateData) {
  switch (type) {
    case 'MERIT_AWARDED':
      return {
        subject: `Merit Points Awarded — ${data.points} pts (${data.category})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Hi ${data.userName},</h2>
            <p>You have been awarded <strong>${data.points} merit points</strong>
            under the <strong>${data.category}</strong> category.</p>
            <p>Log in to view your updated dashboard.</p>
            <br/>
            <p style="color: #888; font-size: 12px;">SMMS — Student Merit Management System</p>
          </div>
        `,
      };

    case 'EVENT_REGISTERED':
      return {
        subject: `Registered for ${data.eventName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Hi ${data.userName},</h2>
            <p>You have successfully registered for <strong>${data.eventName}</strong>
            on <strong>${data.eventDate}</strong>.</p>
            <p>See you there!</p>
            <br/>
            <p style="color: #888; font-size: 12px;">SMMS — Student Merit Management System</p>
          </div>
        `,
      };

    case 'EVENT_REMINDER':
      return {
        subject: `Reminder: ${data.eventName} is coming up`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2>Hi ${data.userName},</h2>
            <p>This is a reminder that <strong>${data.eventName}</strong>
            is happening on <strong>${data.eventDate}</strong>.</p>
            <p>We look forward to seeing you!</p>
            <br/>
            <p style="color: #888; font-size: 12px;">SMMS — Student Merit Management System</p>
          </div>
        `,
      };
  }
}
