import React from 'react';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Import templates
import { EventCreatedEmail } from '@/components/email/templates/EventCreatedEmail';
import { RegistrationConfirmedEmail } from '@/components/email/templates/RegistrationConfirmedEmail';
import { RegistrationWaitlistedEmail } from '@/components/email/templates/RegistrationWaitlistedEmail';
import { RegistrationCancelledEmail } from '@/components/email/templates/RegistrationCancelledEmail';
import { MeritAddedEmail } from '@/components/email/templates/MeritAddedEmail';
import { MeritUpdatedEmail } from '@/components/email/templates/MeritUpdatedEmail';
import { EventCancelledEmail } from '@/components/email/templates/EventCancelledEmail';

export interface EmailOptions {
  to: string;
  subject: string;
  template: 'EVENT_CREATED' | 'REGISTRATION_COMPLETED' | 'REGISTRATION_WAITLISTED' | 'REGISTRATION_CANCELLED' | 'MERIT_ADDED' | 'MERIT_UPDATED' | 'EVENT_CANCELLED';
  props: any;
}

export interface EmailService {
  sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }>;
  sendBatch(options: EmailOptions[]): Promise<{ success: boolean; error?: string; results?: Array<{ success: boolean; error?: string; messageId?: string }> }>;
}

/**
 * Helper to render template dynamically to circumvent build-time import static analysis
 */
async function compileTemplateToHtml(template: string, props: any, recipientEmail: string): Promise<string> {
  let element: React.ReactElement;
  const enrichedProps = {
    ...props,
    recipientEmail,
  };

  switch (template) {
    case 'EVENT_CREATED':
      element = React.createElement(EventCreatedEmail, enrichedProps);
      break;
    case 'REGISTRATION_COMPLETED':
      element = React.createElement(RegistrationConfirmedEmail, enrichedProps);
      break;
    case 'REGISTRATION_WAITLISTED':
      element = React.createElement(RegistrationWaitlistedEmail, enrichedProps);
      break;
    case 'REGISTRATION_CANCELLED':
      element = React.createElement(RegistrationCancelledEmail, enrichedProps);
      break;
    case 'MERIT_ADDED':
      element = React.createElement(MeritAddedEmail, enrichedProps);
      break;
    case 'MERIT_UPDATED':
      element = React.createElement(MeritUpdatedEmail, enrichedProps);
      break;
    case 'EVENT_CANCELLED':
      element = React.createElement(EventCancelledEmail, enrichedProps);
      break;
    default:
      throw new Error(`Unknown email template: ${template}`);
  }

  const { renderToStaticMarkup } = await import('react-dom/server');
  return renderToStaticMarkup(element);
}

/**
 * Mock Email Service - Saves HTML output locally inside the scratch directory
 */
export class MockEmailService implements EmailService {
  private outboxDir = path.join(process.cwd(), 'scratch', 'sent-emails');

  constructor() {
    if (!fs.existsSync(this.outboxDir)) {
      fs.mkdirSync(this.outboxDir, { recursive: true });
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      const { to, subject, template, props } = options;
      const html = await compileTemplateToHtml(template, props, to);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${timestamp}_${to.replace(/[@.]/g, '_')}_${template}.html`;
      const filePath = path.join(this.outboxDir, filename);

      const metadata = {
        to,
        subject,
        template,
        timestamp: new Date().toISOString(),
      };

      const fileContent = `<!-- METADATA: ${JSON.stringify(metadata)} -->\n${html}`;
      await fs.promises.writeFile(filePath, fileContent, 'utf8');
      
      console.log(`[MockEmailService] Email written to ${filePath}`);
      return { success: true, messageId: filename };
    } catch (error: any) {
      console.error('[MockEmailService] Failed to send email:', error);
      return { success: false, error: error.message || 'Unknown mock service error' };
    }
  }

  async sendBatch(options: EmailOptions[]): Promise<{ success: boolean; error?: string; results?: Array<{ success: boolean; error?: string; messageId?: string }> }> {
    try {
      console.log(`[MockEmailService] Dispensing batch of ${options.length} emails...`);
      const results = [];
      for (const opt of options) {
        const res = await this.sendEmail(opt);
        results.push(res);
      }
      return { success: true, results };
    } catch (error: any) {
      console.error('[MockEmailService] Failed to send batch:', error);
      return { success: false, error: error.message || 'Unknown mock batch error' };
    }
  }
}

/**
 * Resend Email Service - Integrates with Resend API for production deliveries
 */
export class ResendEmailService implements EmailService {
  private resend: Resend;
  private fromAddress = 'onboarding@resend.dev'; // Default sandbox domain from Resend

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('[ResendEmailService] Missing RESEND_API_KEY environment variable.');
    }
    this.resend = new Resend(apiKey);
    console.log('[ResendEmailService] Initialized with Resend API Key');
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      const { to, subject, template, props } = options;
      const html = await compileTemplateToHtml(template, props, to);

      console.log(`[ResendEmailService] Initiating Resend delivery to ${to}...`);
      const response = await this.resend.emails.send({
        from: `SMMS <${this.fromAddress}>`,
        to,
        subject,
        html,
      });

      if (response.error) {
        console.error('[ResendEmailService] Resend API error:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[ResendEmailService] Email sent successfully to ${to}. Message ID: ${response.data?.id}`);
      return { success: true, messageId: response.data?.id || undefined };
    } catch (error: any) {
      console.error('[ResendEmailService] Exception while sending email:', error);
      return { success: false, error: error.message || 'Unknown Resend service error' };
    }
  }

  async sendBatch(options: EmailOptions[]): Promise<{ success: boolean; error?: string; results?: Array<{ success: boolean; error?: string; messageId?: string }> }> {
    try {
      if (options.length === 0) {
        return { success: true, results: [] };
      }

      console.log(`[ResendEmailService] Dispatching batch of ${options.length} emails concurrently via Resend...`);

      const settled = await Promise.allSettled(
        options.map((opt) => this.sendEmail(opt))
      );

      const results = settled.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return { success: false, error: (result.reason as Error)?.message || 'Unknown batch item error' };
      });

      const successCount = results.filter((r) => r.success).length;
      console.log(`[ResendEmailService] Batch complete. ${successCount}/${options.length} succeeded.`);
      return { success: true, results };
    } catch (error: any) {
      console.error('[ResendEmailService] Exception while batching emails:', error);
      return { success: false, error: error.message || 'Unknown Resend batch error' };
    }
  }
}

// Instantiate matching email service implementation
const isResendConfigured = !!(
  process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY.startsWith('re_')
);

export const emailService: EmailService = isResendConfigured
  ? new ResendEmailService()
  : new MockEmailService();
