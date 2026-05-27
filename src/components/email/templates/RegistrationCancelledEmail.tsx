import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface RegistrationCancelledEmailProps {
  recipientEmail?: string;
  recipientName: string;
  eventTitle: string;
  eventDate: string;
  wasPromotedFromWaitlist?: boolean;
}

export const RegistrationCancelledEmail: React.FC<RegistrationCancelledEmailProps> = ({
  recipientEmail,
  recipientName,
  eventTitle,
  eventDate,
  wasPromotedFromWaitlist = false,
}) => {
  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={{ ...emailStyles.badge, backgroundColor: '#fee2e2', color: '#b91c1c' }}>Registration Cancelled</span>
      
      {wasPromotedFromWaitlist ? (
        <>
          <h1 style={emailStyles.title}>Good news, {recipientName}!</h1>
          <p>A slot has opened up, and you have been **promoted from the waitlist** to registered status!</p>
          
          <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '6px', margin: '20px 0', border: '1px solid #bbf7d0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a', margin: '0 0 4px 0' }}>Promoted to Registered</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#15803d' }}>You are now officially registered for <strong>{eventTitle}</strong> on {eventDate}. Make sure to attend to receive points!</p>
          </div>
          
          <a href="/dashboard" style={emailStyles.button}>View Registered Events</a>
        </>
      ) : (
        <>
          <h1 style={emailStyles.title}>Registration Cancelled</h1>
          <p>Hi {recipientName}, this is to confirm that your registration for the following event has been cancelled.</p>
          
          <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '6px', margin: '20px 0', border: '1px solid #f3f4f6' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
              <strong>Event:</strong> {eventTitle}
              <br />
              <strong>Date:</strong> {eventDate}
            </p>
          </div>
          
          <p>We hope to see you at another event soon! You can browse other available activities inside the dashboard.</p>
          
          <a href="/events" style={emailStyles.button}>Browse More Events</a>
        </>
      )}
    </EmailLayout>
  );
};
