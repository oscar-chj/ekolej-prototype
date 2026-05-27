import { NextRequest } from 'next/server';
import { ResendEmailService, MockEmailService, EmailOptions } from '@/lib/services/emailService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, to, subject, props } = body;

    const recipient = to || 'onboarding@resend.dev';
    const emailSubject = subject || `Sample: ${template.replace(/_/g, ' ')}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !apiKey.startsWith('re_')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'RESEND_API_KEY is not configured or invalid in your .env file. Please configure a valid key starting with "re_" to send via Resend.' 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resendService = new ResendEmailService();
    const options: EmailOptions = {
      to: recipient,
      subject: emailSubject,
      template,
      props,
    };

    console.log(`[SendTest] Dispatching real Resend email to ${recipient}...`);
    const resendResult = await resendService.sendEmail(options);

    if (!resendResult.success) {
      return new Response(
        JSON.stringify({ success: false, error: resendResult.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Archiving a copy of the sent email in the local developer outbox for the user to review.
    try {
      const mockService = new MockEmailService();
      const archiveOptions: EmailOptions = {
        ...options,
        subject: `[SENT VIA RESEND] ${options.subject}`,
      };
      await mockService.sendEmail(archiveOptions);
    } catch (archiveErr) {
      console.error('[SendTest] Failed to write copy to local outbox:', archiveErr);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: resendResult.messageId,
        recipient: recipient
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[SendTest] Exception during test dispatch:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
