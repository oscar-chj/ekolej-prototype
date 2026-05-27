import React from 'react';

export const emailStyles = {
  container: {
    fontFamily: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    padding: '32px 24px',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  header: {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#0f172a',
    textDecoration: 'none',
    letterSpacing: '-0.025em',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f172a',
    margin: '0 0 16px 0',
    lineHeight: '1.25',
    letterSpacing: '-0.025em',
  },
  body: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#334155',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    marginTop: '16px',
    textAlign: 'center' as const,
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  metaTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    margin: '20px 0',
    fontSize: '14px',
  },
  metaRow: {
    borderBottom: '1px dashed #e2e8f0',
  },
  metaLabel: {
    padding: '10px 0',
    color: '#64748b',
    fontWeight: '500',
    width: '120px',
  },
  metaValue: {
    padding: '10px 0',
    color: '#0f172a',
    fontWeight: '600',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
    fontSize: '12px',
    color: '#94a3b8',
    textAlign: 'center' as const,
    lineHeight: '1.5',
  },
  link: {
    color: '#0f172a',
    textDecoration: 'underline',
    fontWeight: '500',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '24px 0',
    border: 'none',
  }
};

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
  recipientEmail?: string;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  children,
  recipientEmail = 'onboarding@resend.dev'
}) => {
  const unsubscribeUrl = `/admin/email-preview?email=${encodeURIComponent(recipientEmail)}&action=unsubscribe`;

  return (
    <div style={emailStyles.container}>
      {/* Header */}
      <div style={emailStyles.header}>
        <a href="#" style={emailStyles.logo}>SMMS</a>
      </div>

      {/* Main Content */}
      <div style={emailStyles.body}>
        {children}
      </div>

      {/* Footer */}
      <div style={emailStyles.footer}>
        <p>© {new Date().getFullYear()} Student Merit Management System (SMMS). All rights reserved.</p>
        <p>
          You are receiving this because you are registered as {recipientEmail}.
          <br />
          <a href={unsubscribeUrl} style={emailStyles.link}>Unsubscribe</a> from these notifications at any time.
        </p>
      </div>
    </div>
  );
};
