import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface RegistrationWaitlistedEmailProps {
  recipientEmail?: string;
  recipientName: string;
  eventTitle: string;
  eventCategory: string;
  eventPoints: number;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

export const RegistrationWaitlistedEmail: React.FC<RegistrationWaitlistedEmailProps> = ({
  recipientEmail,
  recipientName,
  eventTitle,
  eventCategory,
  eventPoints,
  eventDate,
  eventTime,
  eventLocation,
}) => {
  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={{ ...emailStyles.badge, backgroundColor: '#fef3c7', color: '#b45309' }}>Added to Waitlist</span>
      <h1 style={emailStyles.title}>You are on the waitlist, {recipientName}</h1>
      <p>The event is currently at full capacity. We've placed you on the waitlist. If a registered student cancels their slot, you will be promoted automatically to "Registered" and notified via email.</p>

      <table style={emailStyles.metaTable}>
        <tbody>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Event</td>
            <td style={emailStyles.metaValue}>{eventTitle}</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Category</td>
            <td style={emailStyles.metaValue}>{eventCategory}</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Merit Points</td>
            <td style={emailStyles.metaValue}>+{eventPoints} Points</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Date</td>
            <td style={emailStyles.metaValue}>{eventDate}</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Time</td>
            <td style={emailStyles.metaValue}>{eventTime}</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Location</td>
            <td style={emailStyles.metaValue}>{eventLocation}</td>
          </tr>
        </tbody>
      </table>

      <a href="/dashboard" style={emailStyles.button}>Check Waitlist Status</a>
    </EmailLayout>
  );
};
