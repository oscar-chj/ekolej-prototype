import { NextRequest } from 'next/server';
import React from 'react';

export const dynamic = 'force-dynamic';

// Import templates
import { EventCreatedEmail } from '@/components/email/templates/EventCreatedEmail';
import { RegistrationConfirmedEmail } from '@/components/email/templates/RegistrationConfirmedEmail';
import { RegistrationWaitlistedEmail } from '@/components/email/templates/RegistrationWaitlistedEmail';
import { RegistrationCancelledEmail } from '@/components/email/templates/RegistrationCancelledEmail';
import { MeritAddedEmail } from '@/components/email/templates/MeritAddedEmail';
import { MeritUpdatedEmail } from '@/components/email/templates/MeritUpdatedEmail';
import { EventCancelledEmail } from '@/components/email/templates/EventCancelledEmail';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') || 'EVENT_CREATED';
    const email = searchParams.get('email') || 'student@upm.edu.my';
    const name = searchParams.get('name') || 'Ahmad Firdaus';
    
    // Dynamic fields mapping
    let element: React.ReactElement;

    switch (template) {
      case 'EVENT_CREATED':
        element = React.createElement(EventCreatedEmail, {
          recipientEmail: email,
          recipientName: name,
          eventTitle: searchParams.get('eventTitle') || 'Introduction to Machine Learning Workshop',
          eventDescription: searchParams.get('eventDescription') || 'Gain solid baseline knowledge of foundational ML algorithms, standard neural networks, and Python workflows.',
          eventCategory: searchParams.get('eventCategory') || 'UNIVERSITY',
          eventPoints: parseInt(searchParams.get('eventPoints') || '15'),
          eventDate: searchParams.get('eventDate') || '2026-06-15',
          eventTime: searchParams.get('eventTime') || '10:00 AM - 01:00 PM',
          eventLocation: searchParams.get('eventLocation') || 'Dewan Kuliah Utama, FSKTM',
        });
        break;

      case 'REGISTRATION_COMPLETED':
        element = React.createElement(RegistrationConfirmedEmail, {
          recipientEmail: email,
          recipientName: name,
          eventTitle: searchParams.get('eventTitle') || 'Introduction to Machine Learning Workshop',
          eventCategory: searchParams.get('eventCategory') || 'UNIVERSITY',
          eventPoints: parseInt(searchParams.get('eventPoints') || '15'),
          eventDate: searchParams.get('eventDate') || '2026-06-15',
          eventTime: searchParams.get('eventTime') || '10:00 AM - 01:00 PM',
          eventLocation: searchParams.get('eventLocation') || 'Dewan Kuliah Utama, FSKTM',
        });
        break;

      case 'REGISTRATION_WAITLISTED':
        element = React.createElement(RegistrationWaitlistedEmail, {
          recipientEmail: email,
          recipientName: name,
          eventTitle: searchParams.get('eventTitle') || 'Advanced React & Next.js Bootcamp',
          eventCategory: searchParams.get('eventCategory') || 'FACULTY',
          eventPoints: parseInt(searchParams.get('eventPoints') || '20'),
          eventDate: searchParams.get('eventDate') || '2026-06-20',
          eventTime: searchParams.get('eventTime') || '09:00 AM - 05:00 PM',
          eventLocation: searchParams.get('eventLocation') || 'Lab 3, Block A, FSKTM',
        });
        break;

      case 'REGISTRATION_CANCELLED':
        element = React.createElement(RegistrationCancelledEmail, {
          recipientEmail: email,
          recipientName: name,
          eventTitle: searchParams.get('eventTitle') || 'Advanced React & Next.js Bootcamp',
          eventDate: searchParams.get('eventDate') || '2026-06-20',
          wasPromotedFromWaitlist: searchParams.get('wasPromoted') === 'true',
        });
        break;

      case 'MERIT_ADDED':
        element = React.createElement(MeritAddedEmail, {
          recipientEmail: email,
          recipientName: name,
          points: parseInt(searchParams.get('points') || '10'),
          category: searchParams.get('category') || 'COLLEGE',
          description: searchParams.get('description') || 'Volunteering in College Cleaning Campaign',
          totalMeritPoints: parseInt(searchParams.get('totalPoints') || '35'),
          targetPoints: parseInt(searchParams.get('targetPoints') || '50'),
        });
        break;

      case 'MERIT_UPDATED':
        element = React.createElement(MeritUpdatedEmail, {
          recipientEmail: email,
          recipientName: name,
          previousPoints: parseInt(searchParams.get('prevPoints') || '10'),
          newPoints: parseInt(searchParams.get('points') || '15'),
          category: searchParams.get('category') || 'COLLEGE',
          description: searchParams.get('description') || 'Volunteering in College Cleaning Campaign',
          reasonForUpdate: searchParams.get('reason') || 'Correction of volunteer duration from 2 hours to 4 hours.',
          totalMeritPoints: parseInt(searchParams.get('totalPoints') || '40'),
        });
        break;

      case 'EVENT_CANCELLED':
        element = React.createElement(EventCancelledEmail, {
          recipientEmail: email,
          recipientName: name,
          eventTitle: searchParams.get('eventTitle') || 'Introduction to Machine Learning Workshop',
          eventDate: searchParams.get('eventDate') || '2026-06-15',
          cancellationReason: searchParams.get('reason') || 'Speaker had an urgent health issue.',
        });
        break;

      default:
        return new Response('Template not found', { status: 404 });
    }

    const { renderToStaticMarkup } = await import('react-dom/server');
    const html = renderToStaticMarkup(element);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return new Response('Error rendering email template', { status: 500 });
  }
}
