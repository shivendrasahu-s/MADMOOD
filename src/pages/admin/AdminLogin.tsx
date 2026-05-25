import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFirebaseEnabled, auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ success: true, text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const adminSession = sessionStorage.getItem('mmi_admin_authenticated');
    if (adminSession === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ success: true, text: '' });

    if (!email.trim() || !password.trim()) {
      setStatusMsg({ success: false, text: 'REQUIRED FIELDS: Enter email and password.' });
      setLoading(false);
      return;
    }

    if (isFirebaseEnabled && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('mmi_admin_authenticated', 'true');
        navigate('/admin/dashboard');
      } catch (error: any) {
        console.error('Firebase Admin Authentication error:', error);
        setStatusMsg({ 
          success: false, 
          text: error.message || 'AUTH FAILED: Invalid admin credentials.' 
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Local simulated admin credentials
      setTimeout(() => {
        if (email.toLowerCase().trim() === 'admin@madmood.in' && password === 'admin123') {
          sessionStorage.setItem('mmi_admin_authenticated', 'true');
          navigate('/admin/dashboard');
        } else {
          setStatusMsg({ 
            success: false, 
            text: 'MOCK AUTH FAILED: Enter admin@madmood.in & admin123 to login in simulation mode.' 
          });
        }
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div style={{
      padding: '6rem 0',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-gray-light)',
      fontFamily: 'var(--font-body)'
    }}>
      <div className="container" style={{ maxWidth: '440px', width: '100%' }}>
        
        {/* Firebase adapter warning */}
        {!isFirebaseEnabled && (
          <div style={{
            background: 'rgba(255, 169, 0, 0.08)',
            border: '1.5px solid #ffa900',
            color: '#c28500',
            padding: '0.85rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '4px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            lineHeight: '1.4'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <strong>Simulated Offline Mode Active:</strong> Firebase env keys not detected. Log in with <span style={{ color: '#000' }}>admin@madmood.in</span> / <span style={{ color: '#000' }}>admin123</span>.
            </div>
          </div>
        )}

        <div style={{
          padding: '3rem 2.5rem',
          border: '1px solid var(--color-gray-border)',
          borderRadius: 'var(--radius-lg)',
          background: '#ffffff',
          boxShadow: 'var(--shadow-medium)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <ShieldCheck size={36} color="var(--color-primary)" style={{ marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
            <h2 style={{ fontSize: '1.35rem', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              MAD MOOD CONTROL PORTAL
            </h2>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem', marginTop: '6px' }}>
              Authorize credential access to manage inventory, sales, and products.
            </p>
          </div>

          {/* Alert logs */}
          {statusMsg.text && (
            <div style={{
              background: statusMsg.success ? 'rgba(3, 166, 133, 0.08)' : 'rgba(255, 29, 64, 0.08)',
              border: `1px solid ${statusMsg.success ? 'var(--color-success)' : '#ff1d40'}`,
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: statusMsg.success ? 'var(--color-success)' : '#ff1d40',
              marginBottom: '1.5rem',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {statusMsg.text}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>ADMINISTRATOR EMAIL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="admin@madmood.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                  required
                />
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>ACCESS CODE / PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                  required
                />
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-accent-m" 
              style={{ padding: '0.85rem', marginTop: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={loading}
            >
              {loading ? 'AUTHORIZING ACCESS...' : 'ENTER SYSTEM'} <ArrowRight size={14} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-primary)',
  fontWeight: 700,
  marginBottom: '6px',
  letterSpacing: '0.04em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '0.65rem 0.75rem',
  color: '#000000',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  borderRadius: '4px',
  boxSizing: 'border-box'
};
