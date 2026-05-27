import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface EventCancelledEmailProps {
  recipientEmail?: string;
  recipientName: string;
  eventTitle: string;
  eventDate: string;
  cancellationReason?: string;
}

export const EventCancelledEmail: React.FC<EventCancelledEmailProps> = ({
  recipientEmail,
  recipientName,
  eventTitle,
  eventDate,
  cancellationReason = 'Event cancelled by organizer.',
}) => {
  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={{ ...emailStyles.badge, backgroundColor: '#fee2e2', color: '#b91c1c' }}>Event Cancelled</span>
      <h1 style={emailStyles.title}>Important: Event Cancellation</h1>
      <p>Hi {recipientName}, we regret to inform you that the event you registered for has been cancelled. Here are the details:</p>

      <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '6px', margin: '20px 0', border: '1px solid #fecaca' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold', color: '#991b1b' }}>{eventTitle}</p>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#7f1d1d' }}>Originally scheduled for {eventDate}</p>
        <div style={{ height: '1px', backgroundColor: '#fca5a5', margin: '12px 0' }} />
        <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
          <strong>Reason for Cancellation:</strong>
          <br />
          <span style={{ fontStyle: 'italic' }}>"{cancellationReason}"</span>
        </p>
      </div>

      <p>If you have any questions, please contact the event organizer. You can browse other upcoming events and register to earn your merit points inside the portal.</p>

      <a href="/events" style={emailStyles.button}>Explore Alternative Events</a>
    </EmailLayout>
  );
};
