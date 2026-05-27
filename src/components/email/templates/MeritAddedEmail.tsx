import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface MeritAddedEmailProps {
  recipientEmail?: string;
  recipientName: string;
  points: number;
  category: string;
  description: string;
  totalMeritPoints: number;
  targetPoints: number;
}

export const MeritAddedEmail: React.FC<MeritAddedEmailProps> = ({
  recipientEmail,
  recipientName,
  points,
  category,
  description,
  totalMeritPoints,
  targetPoints = 50,
}) => {
  const remaining = Math.max(0, targetPoints - totalMeritPoints);
  const progressPercentage = Math.min(100, Math.round((totalMeritPoints / targetPoints) * 100));

  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={{ ...emailStyles.badge, backgroundColor: '#dcfce7', color: '#15803d' }}>Merit Awarded</span>
      <h1 style={emailStyles.title}>Congratulations, {recipientName}!</h1>
      <p>You have been awarded new merit points in the Student Merit Management System. Here are the details of your award:</p>

      <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', margin: '20px 0', border: '1px solid #bbf7d0', textAlign: 'center' }}>
        <span style={{ fontSize: '14px', color: '#16a34a', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>Points Awarded</span>
        <div style={{ fontSize: '48px', fontWeight: '800', color: '#16a34a', margin: '8px 0' }}>+{points}</div>
        <div style={{ fontSize: '15px', color: '#15803d', fontWeight: '500' }}>{description} ({category})</div>
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '24px 0 12px 0' }}>Your Merit Progress</h2>
      
      {/* Visual Lofi Progress Bar */}
      <div style={{ backgroundColor: '#f1f5f9', height: '12px', borderRadius: '6px', width: '100%', overflow: 'hidden', margin: '12px 0' }}>
        <div style={{ backgroundColor: '#10b981', height: '100%', width: `${progressPercentage}%` }} />
      </div>

      <table style={emailStyles.metaTable}>
        <tbody>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Current Total</td>
            <td style={emailStyles.metaValue}>{totalMeritPoints} / {targetPoints} Points ({progressPercentage}%)</td>
          </tr>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>Remaining</td>
            <td style={emailStyles.metaValue}>{remaining > 0 ? `${remaining} Points to Target` : 'Target Achieved! 🎉'}</td>
          </tr>
        </tbody>
      </table>

      <a href="/dashboard" style={emailStyles.button}>View Merit Breakdown</a>
    </EmailLayout>
  );
};
