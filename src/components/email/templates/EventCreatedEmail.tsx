import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface EventCreatedEmailProps {
  recipientEmail?: string;
  recipientName: string;
  eventTitle: string;
  eventDescription: string;
  eventCategory: string;
  eventPoints: number;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

export const EventCreatedEmail: React.FC<EventCreatedEmailProps> = ({
  recipientEmail,
  recipientName,
  eventTitle,
  eventDescription,
  eventCategory,
  eventPoints,
  eventDate,
  eventTime,
  eventLocation,
}) => {
  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={emailStyles.badge}>New Event Published</span>
      <h1 style={emailStyles.title}>Hi {recipientName}, a new event has been announced!</h1>
      <p>A new student activity has been added to the Student Merit Management System. You can register now to reserve your spot and earn merit points.</p>
      
      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', margin: '20px 0', border: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>{eventTitle}</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{eventDescription}</p>
      </div>

      <table style={emailStyles.metaTable}>
        <tbody>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Category</td>
            <td style={emailStyles.metaValue}>{eventCategory}</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Merit Points</td>
            <td style={emailStyles.metaValue}><span style={{ color: '#10b981', fontWeight: 'bold' }}>+{eventPoints} Points</span></td>
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

      <a href="/events" style={emailStyles.button}>View & Register Now</a>
    </EmailLayout>
  );
};
