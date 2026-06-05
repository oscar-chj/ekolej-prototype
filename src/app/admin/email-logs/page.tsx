"use client";


import React, { useState, useEffect, useTransition } from 'react';

import { sendEmailAction } from "@/app/actions/emailAction";
import { fetchLogsAction } from "@/app/actions/emailAction";

// 1.initialise interface
export interface EmailLog {
  id: string;
  recipient: string;
  status: string;
  description: string;
  createdAt: Date;
}

export default function EmailLogsPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
      setMounted(true);
      fetchLogsAction().then((data) => setLogs(data));
    }, []);
    
  const handleTestSend = () => {
      startTransition(async () => {
        await sendEmailAction("tester@upm.edu.my", "Test Subject", "Hello World!");
        alert("Email logged successfully!");
        const updatedLogs = await fetchLogsAction(); 
        setLogs(updatedLogs); 
      });
    };


  {/*React.useEffect(() => {
    setMounted(true);
  }, []);*/}

    return (
      
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#fcf8fa', padding: '48px 24px', display: 'flex', justifyContent: 'center', alignItems: 'start' }}>
        {/* Central Content Box */}
        <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ffffff', fontSize: '14px', lineHeight: '32px' }}>🛡️</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1d', margin: 0, fontFamily: 'sans-serif' }}>EventGuard</h1>
          </div>

          {/* Page Title & Search Bar Area */}
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
                style={{ width: '100%', height: '42px', backgroundColor: '#f6f3f5', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 16px', fontSize: '14px', color: '#1b1b1d', boxSizing: 'border-box' }} 
                placeholder="Search by email..." 
              />
            </div>
          </div>

          {/* Filters Panel Container - Forced to remain in ONE single row */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'end', width: '100%' }}>
              
              {/* Status Selector Box */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#45464d', paddingLeft: '4px' }}>Status</label>
                <select style={{ width: '100%', height: '42px', backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#1b1b1d', appearance: 'auto', boxSizing: 'border-box' }}>
                  <option>All Statuses</option>
                  <option>Delivered</option>
                  <option>Sent</option>
                  <option>Bounced</option>
                  <option>Complained</option>
                  <option>Filtered</option>
                </select>
              </div>

              {/* Timeframe Selector Box */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#45464d', paddingLeft: '4px' }}>Timeframe</label>
                <select style={{ width: '100%', height: '42px', backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '8px', padding: '0 12px', fontSize: '14px', color: '#1b1b1d', appearance: 'auto', boxSizing: 'border-box' }}>
                  <option>Last 24 Hours</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>

              {/* Apply Filters Button Block */}
              <div style={{ flexShrink: 0 }}>
                <button style={{ height: '42px', backgroundColor: '#000000', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.05em', padding: '0 32px', boxSizing: 'border-box' }}>
                  APPLY FILTERS
                </button>
              </div>

            </div>
          </div>

          {/* Table Container */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #c6c6cd', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', width: '100%' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #c6c6cd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcf8fa' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1b1b1d', margin: 0 }}>Recent Deliveries</h3>
            {/*Test email service  */}
            <button 
                onClick={handleTestSend} 
                disabled={isPending}
                style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#000000', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                  {isPending ? "Sending..." : "Test Send Email"}
              </button>
              <span style={{ fontSize: '12px', color: '#45464d', cursor: 'pointer' }}>🔄 Refresh</span>
            </div>
            
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f6f3f5', borderBottom: '1px solid #c6c6cd' }}>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date / Time</th>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recipient</th>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '14px 24px', fontSize: '12px', fontWeight: '600', color: '#45464d', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ color: '#1b1b1d' }}>
                  {logs.length > 0 ? (
                    logs.map((item: any, index: number) => (
                      <tr key={index} style={{ borderBottom: '1px solid #c6c6cd' }}>
                        <td style={{ padding: '20px 24px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'nowrap' }}>
                          <div style={{ fontWeight: '600' }}>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          <div style={{ color: '#45464d', fontSize: '11px', marginTop: '4px' }}>
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: '600' }}>{item.recipient}</div>
                          <div style={{ color: '#45464d', fontSize: '13px', marginTop: '4px' }}>{item.description}</div>
                        </td>
                        
                        <td style={{ padding: '20px 24px', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            padding: '4px 12px', 
                            borderRadius: '9999px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            backgroundColor: item.status.toLowerCase() === 'delivered' ? '#e6f4ea' : '#fce8e6',
                            color: item.status.toLowerCase() === 'delivered' ? '#137333' : '#c5221f',
                            border: item.status.toLowerCase() === 'delivered' ? '1px solid #ceead6' : '1px solid #fad2cf'
                          }}>
                            {item.status}
                          </span>
                        </td>
                        
                        <td style={{ padding: '20px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#000000', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
                            Resend
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>No logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #c6c6cd', backgroundColor: '#fcf8fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#45464d' }}>
              <span style={{ fontWeight: '500' }}>Showing 1 to 2 of 482 email logs</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #c6c6cd', backgroundColor: '#ffffff', opacity: '0.4', cursor: 'not-allowed' }} disabled>&lt;</button>
                <button style={{ padding: '4px 12px', borderRadius: '4px', backgroundColor: '#000000', color: '#ffffff', fontWeight: '600', border: 'none' }}>1</button>
                <button style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #c6c6cd', backgroundColor: '#ffffff', cursor: 'pointer' }}>2</button>
                <button style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #c6c6cd', backgroundColor: '#ffffff', cursor: 'pointer' }}>&gt;</button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
  
  );
}