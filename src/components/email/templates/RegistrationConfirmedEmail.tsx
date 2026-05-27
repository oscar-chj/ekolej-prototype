import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface RegistrationConfirmedEmailProps {
  recipientEmail?: string;
  recipientName: string;
  eventTitle: string;
  eventCategory: string;
  eventPoints: number;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

export const RegistrationConfirmedEmail: React.FC<RegistrationConfirmedEmailProps> = ({
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
      <span style={{ ...emailStyles.badge, backgroundColor: '#dcfce7', color: '#15803d' }}>Registration Confirmed</span>
      <h1 style={emailStyles.title}>You're registered, {recipientName}!</h1>
      <p>Your seat has been reserved for the following event. Please make sure to attend and check in to claim your merit points.</p>

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
            <td style={emailStyles.metaLabel}>Potential Points</td>
            <td style={emailStyles.metaValue}><span style={{ color: '#16a34a', fontWeight: 'bold' }}>+{eventPoints} Points</span></td>
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

      <p style={{ fontSize: '14px', color: '#64748b', marginTop: '16px' }}>Need to make changes? You can cancel your registration at any time through your dashboard before the event begins.</p>
      
      <a href="/dashboard" style={emailStyles.button}>Go to Dashboard</a>
    </EmailLayout>
  );
};
