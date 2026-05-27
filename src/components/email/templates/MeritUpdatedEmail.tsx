import React from 'react';
import { EmailLayout, emailStyles } from './EmailLayout';

interface MeritUpdatedEmailProps {
  recipientEmail?: string;
  recipientName: string;
  previousPoints: number;
  newPoints: number;
  category: string;
  description: string;
  reasonForUpdate: string;
  totalMeritPoints: number;
}

export const MeritUpdatedEmail: React.FC<MeritUpdatedEmailProps> = ({
  recipientEmail,
  recipientName,
  previousPoints,
  newPoints,
  category,
  description,
  reasonForUpdate,
  totalMeritPoints,
}) => {
  const isIncrease = newPoints > previousPoints;
  const diff = Math.abs(newPoints - previousPoints);

  return (
    <EmailLayout recipientEmail={recipientEmail}>
      <span style={{ ...emailStyles.badge, backgroundColor: '#f3f4f6', color: '#374151' }}>Merit Record Updated</span>
      <h1 style={emailStyles.title}>Notification of Merit Update</h1>
      <p>Hi {recipientName}, an administrator has updated a merit record associated with your account. Here are the details of the adjustment:</p>

      <div style={{ backgroundColor: '#fafafa', padding: '16px', borderRadius: '6px', margin: '20px 0', border: '1px solid #f3f4f6' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{description} ({category})</p>
        
        <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b' }}>Previous Points</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{previousPoints} Points</td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b' }}>Updated Points</td>
              <td style={{ padding: '6px 0', fontWeight: 'bold', color: isIncrease ? '#16a34a' : '#dc2626' }}>
                {newPoints} Points ({isIncrease ? `+${diff}` : `-${diff}`})
              </td>
            </tr>
            <tr>
              <td style={{ padding: '6px 0', color: '#64748b', verticalAlign: 'top' }}>Reason for Update</td>
              <td style={{ padding: '6px 0', fontStyle: 'italic', color: '#475569' }}>"{reasonForUpdate}"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table style={emailStyles.metaTable}>
        <tbody>
          <tr style={emailStyles.metaRow}>
            <td style={emailStyles.metaLabel}>New Total Merit</td>
            <td style={emailStyles.metaValue}>{totalMeritPoints} Points</td>
          </tr>
        </tbody>
      </table>

      <a href="/dashboard" style={emailStyles.button}>View My Merit Records</a>
    </EmailLayout>
  );
};
