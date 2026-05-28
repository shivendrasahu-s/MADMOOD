import React, { useState, useEffect } from 'react';
import { Mail, X, Trash2, ChevronRight, Inbox, MessageSquare } from 'lucide-react';
import { getStoredData, setStoredData } from '../services/db';

interface SentEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  timestamp: string;
}

interface SentSMS {
  phone: string;
  message: string;
  timestamp: string;
}

export const MailSimulator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'emails' | 'sms'>('emails');
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [smsLogs, setSmsLogs] = useState<SentSMS[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadLogs = () => {
    const loadedEmails = getStoredData<SentEmail[]>('mmi_sent_emails', []);
    const loadedSms = getStoredData<SentSMS[]>('mmi_sent_sms', []);
    setEmails(loadedEmails);
    setSmsLogs(loadedSms);
  };

  useEffect(() => {
    loadLogs();

    const handleEmailDispatched = () => {
      loadLogs();
      setUnreadCount((prev) => prev + 1);
      // Optional: auto-open drawer or trigger alert
    };

    const handleSmsDispatched = () => {
      loadLogs();
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener('mmi_email_dispatched', handleEmailDispatched);
    window.addEventListener('mmi_sms_dispatched', handleSmsDispatched);

    return () => {
      window.removeEventListener('mmi_email_dispatched', handleEmailDispatched);
      window.removeEventListener('mmi_sms_dispatched', handleSmsDispatched);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all simulation logs?')) {
      setStoredData('mmi_sent_emails', []);
      setStoredData('mmi_sent_sms', []);
      setEmails([]);
      setSmsLogs([]);
      setSelectedEmail(null);
      setUnreadCount(0);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Floating Badge Button */}
      {!isOpen && (
        <button
          onClick={handleToggle}
          style={{
            backgroundColor: '#111',
            color: '#fff',
            border: '2px solid #D4AF37',
            padding: '0.75rem 1.25rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <Inbox size={16} color="#D4AF37" />
          SIMULATION INBOX
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#D4AF37',
              color: '#111',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              fontWeight: 'bold'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Main Simulator Window */}
      {isOpen && (
        <div style={{
          width: '450px',
          height: '600px',
          backgroundColor: '#fff',
          border: '2px solid #111',
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease'
        }}>
          
          {/* Header */}
          <div style={{
            backgroundColor: '#111',
            color: '#fff',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #222'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Inbox size={18} color="#D4AF37" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Notification Logs (Sandbox)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={handleClearLogs}
                title="Clear Logs"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={handleToggle}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #eee',
            backgroundColor: '#f9f9f9'
          }}>
            <button
              onClick={() => { setActiveTab('emails'); setSelectedEmail(null); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderBottom: activeTab === 'emails' ? '2px solid #111' : 'none',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'emails' ? 800 : 500,
                color: activeTab === 'emails' ? '#111' : '#666',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Mail size={14} /> Emails ({emails.length})
            </button>
            <button
              onClick={() => { setActiveTab('sms'); setSelectedEmail(null); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderBottom: activeTab === 'sms' ? '2px solid #111' : 'none',
                backgroundColor: 'transparent',
                fontWeight: activeTab === 'sms' ? 800 : 500,
                color: activeTab === 'sms' ? '#111' : '#666',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <MessageSquare size={14} /> SMS ({smsLogs.length})
            </button>
          </div>

          {/* Viewport Content */}
          <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
            
            {selectedEmail ? (
              /* Email HTML Preview */
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#888', display: 'block' }}>To: {selectedEmail.to}</span>
                    <strong style={{ fontSize: '0.75rem', color: '#111' }}>{selectedEmail.subject}</strong>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    style={{
                      background: 'none',
                      border: '1px solid #111',
                      color: '#111',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      borderRadius: '0px'
                    }}
                  >
                    BACK
                  </button>
                </div>
                <div style={{ flex: 1, border: 'none', overflow: 'hidden' }}>
                  <iframe
                    title="Email Preview"
                    srcDoc={selectedEmail.html}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
              </div>
            ) : activeTab === 'emails' ? (
              /* Emails List */
              emails.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#888' }}>
                  <Mail size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>No simulated emails sent yet.</p>
                  <p style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.5rem' }}>Place an order or trigger an verification OTP code to inspect generated emails.</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700 }}>TO: {email.to}</span>
                        <span style={{ fontSize: '0.65rem', color: '#999' }}>
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#111', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {email.subject}
                      </h4>
                    </div>
                    <ChevronRight size={14} color="#ccc" />
                  </div>
                ))
              )
            ) : (
              /* SMS Logs List */
              smsLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#888' }}>
                  <MessageSquare size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>No simulated SMS notifications.</p>
                </div>
              ) : (
                smsLogs.map((sms, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      backgroundColor: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700 }}>SMS TO: +91 {sms.phone}</span>
                      <span style={{ fontSize: '0.65rem', color: '#999' }}>
                        {new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#333', lineHeight: '1.4', backgroundColor: '#f5f5f5', padding: '0.6rem 0.75rem', borderLeft: '3px solid #111' }}>
                      {sms.message}
                    </p>
                  </div>
                ))
              )
            )}

          </div>

          {/* Footer notice */}
          <div style={{
            padding: '0.5rem',
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #eee',
            fontSize: '0.65rem',
            color: '#666',
            textAlign: 'center'
          }}>
            MAD MOOD Dev Mode Sandbox.
          </div>

        </div>
      )}

      {/* Slideup Animation styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }} />

    </div>
  );
};
