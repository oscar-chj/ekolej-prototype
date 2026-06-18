"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { fetchLogsAction, resendEmailAction } from '@/app/actions/emailAction';

interface EmailEntryProp {
  id: string;
  date: string;
  time: string;
  recipient: string;
  description: string;
  status: 'Delivered' | 'Sent' | 'Bounced' | 'Complained' | 'Filtered';
}

function mapStatus(raw: string): EmailEntryProp['status'] {
  const map: Record<string, EmailEntryProp['status']> = {
    SENT: 'Sent', DELIVERED: 'Delivered', FAILED: 'Bounced',
    BOUNCED: 'Bounced', COMPLAINED: 'Complained', FILTERED: 'Filtered',
  };
  return map[raw.toUpperCase()] ?? 'Sent';
}

const ITEMS_PER_PAGE = 5;

const STATUS_STYLES: Record<EmailEntryProp['status'], { backgroundColor: string; color: string; border: string }> = {
  Delivered: { backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' },
  Sent:      { backgroundColor: '#e8f0fe', color: '#1a73e8', border: '1px solid #c5d8fc' },
  Bounced:   { backgroundColor: '#fce8e6', color: '#c5221f', border: '1px solid #fad2cf' },
  Complained:{ backgroundColor: '#fef7e0', color: '#b06000', border: '1px solid #fde293' },
  Filtered:  { backgroundColor: '#f1f3f4', color: '#5f6368', border: '1px solid #dadce0' },
};

export default function EmailLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<EmailEntryProp[]>([]);
  const [resending, setResending] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    const raw = await fetchLogsAction();
    setLogs(raw.map(r => ({
      id: r.id,
      date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(r.createdAt).toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      recipient: r.recipient,
      description: r.description,
      status: mapStatus(r.status),
    })));
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs, refreshKey]);

  const handleResend = async (id: string) => {
    setResending(id);
    await resendEmailAction(id);
    await loadLogs();
    setResending(null);
  };

  const filtered = logs.filter(entry => {
    const matchStatus = statusFilter === 'All Statuses' || entry.status === statusFilter;
    const matchSearch = entry.recipient.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#fcf8fa', padding: '48px 24px', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#ffffff', fontSize: '14px', lineHeight: '32px' }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1d', margin: 0, fontFamily: 'sans-serif' }}>EventGuard</h1>
        </div>

        {/* Page Title & Search */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '24px', width: '100%' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1b1b1d', letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>Email Delivery Logs</h2>
            <p style={{ fontSize: '14px', color: '#45464d', margin: 0 }}>
              Detailed audit trail of transactional email events for Student Merit Management System.
            </p>
          </div>
          <div style={{ width: '320px', flexShrink: 0 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', height: '42px', backgroundColor: '#f6f3f5', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 16px', fontSize: '14px', color: '#1b1b1d', boxSizing: 'border-box' }}
              placeholder="Search by email..."
            />
          </div>
        </div>

        {/* Filters Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'end', width: '100%' }}>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#45464d', paddingLeft: '4px' }}>Status</label>
              <select value={statusFilter} onChange={handleStatusChange} style={{ width: '100%', height: '42px', backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#1b1b1d', appearance: 'auto', boxSizing: 'border-box' }}>
                <option>All Statuses</option>
                <option>Delivered</option>
                <option>Sent</option>
                <option>Bounced</option>
                <option>Complained</option>
                <option>Filtered</option>
              </select>
            </div>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#45464d', paddingLeft: '4px' }}>Timeframe</label>
              <select style={{ width: '100%', height: '42px', backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#1b1b1d', appearance: 'auto', boxSizing: 'border-box' }}>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ flexShrink: 0 }}>
              <button onClick={() => setCurrentPage(1)} style={{ height: '42px', backgroundColor: '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.05em', padding: '0 32px', boxSizing: 'border-box' }}>
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', width: '100%' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #c6c6cd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcf8fa' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1b1b1d', margin: 0 }}>Recent Deliveries</h3>
            <span onClick={handleRefresh} style={{ fontSize: '12px', color: '#45464d', cursor: 'pointer' }}>🔄 Refresh</span>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table key={refreshKey} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f6f3f5', borderBottom: '1px solid #c6c6cd' }}>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date / Time</th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient</th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: '#1b1b1d' }}>
                {paginated.map((entry, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #c6c6cd' }}>
                    <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '600' }}>{entry.date}</div>
                      <div style={{ color: '#45464d', fontSize: '11px', marginTop: '4px' }}>{entry.time}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: '600' }}>{entry.recipient}</div>
                      <div style={{ color: '#45464d', fontSize: '13px', marginTop: '4px' }}>{entry.description}</div>
                    </td>
                    <td style={{ padding: '20px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', ...STATUS_STYLES[entry.status] }}>
                        {entry.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span
                        onClick={() => handleResend(entry.id)}
                        style={{ color: resending === entry.id ? '#999' : '#000000', fontWeight: '600', cursor: resending === entry.id ? 'not-allowed' : 'pointer', textDecoration: 'underline' }}
                      >{resending === entry.id ? 'Sending...' : 'Resend'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #c6c6cd', backgroundColor: '#fcf8fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#45464d' }}>
            <span style={{ fontWeight: '500' }}>
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} email logs
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #c6c6cd', backgroundColor: '#ffffff', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >&lt;</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ padding: '4px 12px', borderRadius: '4px', backgroundColor: currentPage === page ? '#000000' : '#ffffff', color: currentPage === page ? '#ffffff' : '#1b1b1d', fontWeight: currentPage === page ? '600' : '400', border: '1px solid #c6c6cd', cursor: 'pointer' }}
                >{page}</button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #c6c6cd', backgroundColor: '#ffffff', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >&gt;</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}