'use client';

import React, { useState, useEffect } from 'react';

type TemplateType =
  | 'EVENT_CREATED'
  | 'REGISTRATION_COMPLETED'
  | 'REGISTRATION_WAITLISTED'
  | 'REGISTRATION_CANCELLED'
  | 'MERIT_ADDED'
  | 'MERIT_UPDATED'
  | 'EVENT_CANCELLED';

interface MockData {
  email: string;
  name: string;
  eventTitle: string;
  eventDescription: string;
  eventCategory: string;
  eventPoints: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  wasPromoted: boolean;
  points: string;
  category: string;
  description: string;
  totalPoints: string;
  targetPoints: string;
  prevPoints: string;
  reason: string;
}

interface OutboxEmail {
  filename: string;
  to: string;
  subject: string;
  template: string;
  timestamp: string;
}

export default function EmailPreviewPage() {
  const [activeTab, setActiveTab] = useState<'preview' | 'outbox'>('preview');
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('EVENT_CREATED');
  const [viewportWidth, setViewportWidth] = useState<'desktop' | 'mobile'>('desktop');
  const [emailSubscribed, setEmailSubscribed] = useState<boolean>(true);
  const [showSubscriptionAlert, setShowSubscriptionAlert] = useState<boolean>(false);

  // Outbox states
  const [outboxEmails, setOutboxEmails] = useState<OutboxEmail[]>([]);
  const [selectedOutboxEmail, setSelectedOutboxEmail] = useState<string | null>(null);
  const [isLoadingOutbox, setIsLoadingOutbox] = useState<boolean>(false);

  const [formData, setFormData] = useState<MockData>({
    email: 'student.upm@upm.edu.my',
    name: 'Muhammad Haziq',
    eventTitle: 'Introduction to Machine Learning Workshop',
    eventDescription: 'Gain solid baseline knowledge of foundational ML algorithms, standard neural networks, and Python workflows.',
    eventCategory: 'UNIVERSITY',
    eventPoints: '15',
    eventDate: '2026-06-15',
    eventTime: '10:00 AM - 01:00 PM',
    eventLocation: 'Dewan Kuliah Utama, FSKTM',
    wasPromoted: false,
    points: '10',
    category: 'COLLEGE',
    description: 'Volunteering in College Cleaning Campaign',
    totalPoints: '35',
    targetPoints: '50',
    prevPoints: '10',
    reason: 'Correction of volunteer duration from 2 hours to 4 hours.',
  });

  const fetchOutbox = async () => {
    setIsLoadingOutbox(true);
    try {
      const res = await fetch('/api/email-preview/outbox');
      if (res.ok) {
        const data = await res.json();
        const emails = data.emails || [];
        setOutboxEmails(emails);
        if (emails.length > 0 && !selectedOutboxEmail) {
          setSelectedOutboxEmail(emails[0].filename);
        }
      }
    } catch (e) {
      console.error('Error fetching outbox:', e);
    } finally {
      setIsLoadingOutbox(false);
    }
  };

  const clearOutbox = async () => {
    if (!confirm('Are you sure you want to clear all locally saved mock emails?')) return;
    try {
      const res = await fetch('/api/email-preview/outbox', { method: 'DELETE' });
      if (res.ok) {
        setOutboxEmails([]);
        setSelectedOutboxEmail(null);
      }
    } catch (e) {
      console.error('Error clearing outbox:', e);
    }
  };

  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; error?: string; messageId?: string; recipient?: string } | null>(null);

  const sendTestEmail = async () => {
    setIsSendingTest(true);
    setSendResult(null);
    try {
      let props: any = {};
      if (activeTemplate === 'EVENT_CREATED' || activeTemplate === 'REGISTRATION_COMPLETED' || activeTemplate === 'REGISTRATION_WAITLISTED') {
        props = {
          eventTitle: formData.eventTitle,
          eventCategory: formData.eventCategory,
          eventPoints: parseInt(formData.eventPoints),
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
        };
        if (activeTemplate === 'EVENT_CREATED') {
          props.eventDescription = formData.eventDescription;
        }
      } else if (activeTemplate === 'REGISTRATION_CANCELLED') {
        props = {
          eventTitle: formData.eventTitle,
          eventDate: formData.eventDate,
          wasPromotedFromWaitlist: formData.wasPromoted,
        };
      } else if (activeTemplate === 'MERIT_ADDED') {
        props = {
          points: parseInt(formData.points),
          category: formData.category,
          description: formData.description,
          totalMeritPoints: parseInt(formData.totalPoints),
          targetPoints: parseInt(formData.targetPoints),
        };
      } else if (activeTemplate === 'MERIT_UPDATED') {
        props = {
          previousPoints: parseInt(formData.prevPoints),
          newPoints: parseInt(formData.points),
          category: formData.category,
          description: formData.description,
          reasonForUpdate: formData.reason,
          totalMeritPoints: parseInt(formData.totalPoints),
        };
      } else if (activeTemplate === 'EVENT_CANCELLED') {
        props = {
          eventTitle: formData.eventTitle,
          eventDate: formData.eventDate,
          cancellationReason: formData.reason,
        };
      }

      const res = await fetch('/api/email-preview/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: activeTemplate,
          to: 'onboarding@resend.dev',
          props,
        }),
      });

      const data = await res.json();
      setSendResult({
        success: data.success,
        error: data.error,
        messageId: data.messageId,
        recipient: data.recipient,
      });

      if (data.success) {
        await fetchOutbox();
        // Clear status alert after 10 seconds
        setTimeout(() => setSendResult(null), 10000);
      }
    } catch (e: any) {
      setSendResult({
        success: false,
        error: e.message || 'Failed to dispatch test request.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  useEffect(() => {
    fetchOutbox();
    const interval = setInterval(fetchOutbox, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const toggleSubscription = () => {
    setEmailSubscribed(!emailSubscribed);
    setShowSubscriptionAlert(true);
    setTimeout(() => {
      setShowSubscriptionAlert(false);
    }, 3000);
  };

  const getPreviewUrl = () => {
    if (activeTab === 'outbox' && selectedOutboxEmail) {
      return `/api/email-preview/outbox?file=${encodeURIComponent(selectedOutboxEmail)}`;
    }

    const params = new URLSearchParams();
    params.set('template', activeTemplate);
    params.set('email', formData.email);
    params.set('name', formData.name);

    if (activeTemplate === 'EVENT_CREATED' || activeTemplate === 'REGISTRATION_COMPLETED' || activeTemplate === 'REGISTRATION_WAITLISTED') {
      params.set('eventTitle', formData.eventTitle);
      params.set('eventCategory', formData.eventCategory);
      params.set('eventPoints', formData.eventPoints);
      params.set('eventDate', formData.eventDate);
      params.set('eventTime', formData.eventTime);
      params.set('eventLocation', formData.eventLocation);
      if (activeTemplate === 'EVENT_CREATED') {
        params.set('eventDescription', formData.eventDescription);
      }
    } else if (activeTemplate === 'REGISTRATION_CANCELLED') {
      params.set('eventTitle', formData.eventTitle);
      params.set('eventDate', formData.eventDate);
      params.set('wasPromoted', String(formData.wasPromoted));
    } else if (activeTemplate === 'MERIT_ADDED') {
      params.set('points', formData.points);
      params.set('category', formData.category);
      params.set('description', formData.description);
      params.set('totalPoints', formData.totalPoints);
      params.set('targetPoints', formData.targetPoints);
    } else if (activeTemplate === 'MERIT_UPDATED') {
      params.set('prevPoints', formData.prevPoints);
      params.set('points', formData.points);
      params.set('category', formData.category);
      params.set('description', formData.description);
      params.set('reason', formData.reason);
      params.set('totalPoints', formData.totalPoints);
    } else if (activeTemplate === 'EVENT_CANCELLED') {
      params.set('eventTitle', formData.eventTitle);
      params.set('eventDate', formData.eventDate);
      params.set('reason', formData.reason);
    }

    return `/api/email-preview?${params.toString()}`;
  };

  const getTemplateLabel = (template: string) => {
    return template.replace(/_/g, ' ');
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-800 font-sans flex overflow-hidden">
      {/* Left Sidebar Pane: Control Panel */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-xs">
        {/* Title branding (replaces heavy navbar) */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center font-bold text-white text-xs">
              M
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">Email Developer Console</h1>
          </div>

          {/* High-quality sliding segment selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 mt-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all ${activeTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Templates
            </button>
            <button
              onClick={() => {
                setActiveTab('outbox');
                fetchOutbox();
              }}
              className={`flex-1 py-1 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${activeTab === 'outbox'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Outbox
              {outboxEmails.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-900 text-white">
                  {outboxEmails.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'preview' ? (
          <>
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Simple preferences block */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Email Subscription State</span>
                  <button
                    onClick={toggleSubscription}
                    className={`text-[10px] px-2 py-1 rounded-md font-semibold transition ${emailSubscribed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      }`}
                  >
                    {emailSubscribed ? 'Subscribed' : 'Unsubscribed'}
                  </button>
                </div>

                {showSubscriptionAlert && (
                  <div className="mt-2.5 p-2 bg-slate-950 text-white rounded text-[10px] font-medium animate-fadeIn flex justify-between">
                    <span>Preferences saved!</span>
                    <span className="text-slate-400">emailSubscribed: {String(emailSubscribed)}</span>
                  </div>
                )}
              </div>

              {/* Template Selector dropdown */}
              <div className="p-4 border-b border-slate-100">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Template Preset
                </label>
                <select
                  value={activeTemplate}
                  onChange={(e) => setActiveTemplate(e.target.value as TemplateType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                >
                  <option value="EVENT_CREATED">Event Announcement</option>
                  <option value="REGISTRATION_COMPLETED">Registration Confirmed</option>
                  <option value="REGISTRATION_WAITLISTED">Waitlisted</option>
                  <option value="REGISTRATION_CANCELLED">Registration Cancelled</option>
                  <option value="MERIT_ADDED">Merit Awarded</option>
                  <option value="MERIT_UPDATED">Merit Adjustment</option>
                  <option value="EVENT_CANCELLED">Event Cancelled</option>
                </select>
              </div>

              {/* Template dynamic fields */}
              <div className="p-4 space-y-3.5 flex-1">
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mock Template Data
                </span>

                {/* Recipient Details */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Conditional parameters */}
                {(activeTemplate === 'EVENT_CREATED' || activeTemplate === 'REGISTRATION_COMPLETED' || activeTemplate === 'REGISTRATION_WAITLISTED') && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Event Title</label>
                      <input
                        type="text"
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                    {activeTemplate === 'EVENT_CREATED' && (
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Description</label>
                        <textarea
                          name="eventDescription"
                          value={formData.eventDescription}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Category</label>
                        <select
                          name="eventCategory"
                          value={formData.eventCategory}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                        >
                          <option value="UNIVERSITY">UNIVERSITY</option>
                          <option value="FACULTY">FACULTY</option>
                          <option value="COLLEGE">COLLEGE</option>
                          <option value="CLUB">CLUB</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Points</label>
                        <input
                          type="number"
                          name="eventPoints"
                          value={formData.eventPoints}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Date & Time</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                        />
                        <input
                          type="text"
                          name="eventTime"
                          value={formData.eventTime}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Location</label>
                      <input
                        type="text"
                        name="eventLocation"
                        value={formData.eventLocation}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs focus:outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>
                )}

                {activeTemplate === 'REGISTRATION_CANCELLED' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Event Title</label>
                      <input
                        type="text"
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Event Date</label>
                      <input
                        type="text"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="checkbox"
                        id="wasPromoted"
                        name="wasPromoted"
                        checked={formData.wasPromoted}
                        onChange={handleCheckboxChange}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-500 text-xs"
                      />
                      <label htmlFor="wasPromoted" className="text-[11px] text-slate-600 font-medium">
                        Simulate Waitlist Promotion
                      </label>
                    </div>
                  </div>
                )}

                {activeTemplate === 'MERIT_ADDED' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Awarded Points</label>
                        <input
                          type="number"
                          name="points"
                          value={formData.points}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        >
                          <option value="UNIVERSITY">UNIVERSITY</option>
                          <option value="FACULTY">FACULTY</option>
                          <option value="COLLEGE">COLLEGE</option>
                          <option value="CLUB">CLUB</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Activity Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Total Points</label>
                        <input
                          type="number"
                          name="totalPoints"
                          value={formData.totalPoints}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Target</label>
                        <input
                          type="number"
                          name="targetPoints"
                          value={formData.targetPoints}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTemplate === 'MERIT_UPDATED' && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Before</label>
                        <input
                          type="number"
                          name="prevPoints"
                          value={formData.prevPoints}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">After</label>
                        <input
                          type="number"
                          name="points"
                          value={formData.points}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        >
                          <option value="UNIVERSITY">UNIVERSITY</option>
                          <option value="FACULTY">FACULTY</option>
                          <option value="COLLEGE">COLLEGE</option>
                          <option value="CLUB">CLUB</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">Total</label>
                        <input
                          type="number"
                          name="totalPoints"
                          value={formData.totalPoints}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Activity Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Reason for Edit</label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}

                {activeTemplate === 'EVENT_CANCELLED' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Event Title</label>
                      <input
                        type="text"
                        name="eventTitle"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Event Date</label>
                      <input
                        type="text"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Reason for Cancellation</label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-white border border-slate-200 rounded py-1 px-1.5 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resend Send Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
              <button
                onClick={sendTestEmail}
                disabled={isSendingTest}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-white shadow-xs transition duration-200 flex items-center justify-center gap-2 ${isSendingTest
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                  }`}
              >
                {isSendingTest ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending Real Email...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">✉️</span>
                    <span>Send Sample to onboarding@resend.dev</span>
                  </>
                )}
              </button>

              {sendResult && (
                <div
                  className={`p-2.5 rounded-lg text-[10px] leading-relaxed border animate-fadeIn ${sendResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                >
                  {sendResult.success ? (
                    <div>
                      <div className="font-bold flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs">✅</span> Dispatch Succeeded!
                      </div>
                      <p className="text-[9.5px] text-slate-600 mb-1.5 leading-normal">
                        Dispatched to <strong>{sendResult.recipient}</strong>. A copy has been saved in your local dev outbox for preview.
                      </p>
                      {sendResult.messageId && (
                        <div className="font-mono text-[8px] bg-white p-1 rounded border border-slate-100 select-all truncate">
                          ID: {sendResult.messageId}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs">❌</span> Dispatch Failed
                      </div>
                      <p className="text-[9.5px] leading-snug">{sendResult.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Outbox list header actions */}
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Captured ({outboxEmails.length})
              </span>
              <button
                onClick={clearOutbox}
                className="px-2 py-0.5 text-[9px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition"
              >
                Clear Outbox
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {isLoadingOutbox && outboxEmails.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                  Scanning outbox...
                </div>
              ) : outboxEmails.length === 0 ? (
                <div className="p-6 text-center h-full flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2">📬</span>
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Outbox Empty</h4>
                  <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed">
                    Trigger system actions to write mock emails here.
                  </p>
                </div>
              ) : (
                outboxEmails.map((email) => (
                  <button
                    key={email.filename}
                    onClick={() => setSelectedOutboxEmail(email.filename)}
                    className={`w-full text-left p-3.5 transition-all hover:bg-slate-50/50 flex flex-col gap-1 ${selectedOutboxEmail === email.filename
                        ? 'bg-slate-50 border-l-2 border-slate-900 pl-3'
                        : 'border-l-2 border-transparent'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[8px] px-1 py-0.2 bg-slate-100 border border-slate-200 rounded font-semibold text-slate-600">
                        {getTemplateLabel(email.template)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate w-full">{email.subject}</h4>
                    <p className="text-[9px] text-slate-400 truncate w-full">To: {email.to}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Minimal developer footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[9px] text-slate-400 flex items-center justify-between">
          <span>Outbox: scratch/sent-emails/</span>
          <span className="font-mono bg-slate-200 px-1 py-0.2 rounded font-bold text-[8px] text-slate-600">
            Resend SDK
          </span>
        </div>
      </aside>

      {/* Right Preview Workspace Pane */}
      <main className="flex-1 bg-slate-150 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col overflow-hidden">
        {/* Floating clean viewport header */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xxs">
          {/* Mode Switcher pills */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewportWidth('desktop')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewportWidth === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewportWidth('mobile')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewportWidth === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Mobile
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOutbox}
              className="text-[10px] font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded transition"
            >
              Refresh
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeTab === 'preview' ? 'Rendered TSX Email Output' : 'Captured Mock HTML File'}
            </span>
          </div>
        </div>

        {/* Unified clean simulator screen */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          {activeTab === 'preview' && !emailSubscribed ? (
            <div className="text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm max-w-sm">
              <div className="text-2xl mb-2">🔕</div>
              <h3 className="text-xs font-bold text-slate-900 mb-1">Email Delivery Silenced</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                This student has unsubscribed from notifications. The activity logs will record this action but avoid dispatching email alerts.
              </p>
              <button
                onClick={() => setEmailSubscribed(true)}
                className="mt-3.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition"
              >
                Re-activate Subscriptions
              </button>
            </div>
          ) : (
            <div
              className={`bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${viewportWidth === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full max-w-[620px] h-[640px]'
                }`}
            >
              {activeTab === 'preview' ? (
                <iframe
                  src={getPreviewUrl()}
                  className="w-full h-full border-none"
                  title="Email Preview Frame"
                />
              ) : selectedOutboxEmail ? (
                <iframe
                  key={selectedOutboxEmail}
                  src={getPreviewUrl()}
                  className="w-full h-full border-none"
                  title="Sent Email Content Preview"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <span className="text-2xl mb-2">📬</span>
                  <h3 className="text-xs font-bold text-slate-950 mb-1">No Email Selected</h3>
                  <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                    Select a sandboxed mock email from the list on the left to preview it.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
