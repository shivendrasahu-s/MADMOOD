import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const Auth: React.FC = () => {
  const { userLogin, userRegister, googleLogin, forgotPassword } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState(''); // Visual lock / firebase password
  
  // States
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ success: true, text: '' });
  const navigate = useNavigate();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg({ success: true, text: '' });

    if (!email.trim()) {
      setStatusMsg({ success: false, text: 'REQUIRED FIELD: Email is mandatory.' });
      return;
    }

    if (authMode === 'signin') {
      const res = await userLogin(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setStatusMsg({ success: false, text: res.message });
      }
    } else if (authMode === 'signup') {
      if (!firstName.trim() || !lastName.trim()) {
        setStatusMsg({ success: false, text: 'REQUIRED FIELDS: First and Last name are mandatory.' });
        return;
      }
      const res = await userRegister(email, firstName, lastName, password);
      if (res.success) {
        setShowVerificationAlert(true);
      } else {
        setStatusMsg({ success: false, text: res.message });
      }
    } else if (authMode === 'forgot') {
      const res = await forgotPassword(email);
      if (res.success) {
        setStatusMsg({ success: true, text: res.message });
      } else {
        setStatusMsg({ success: false, text: res.message });
      }
    }
  };

  const handleGoogleLoginMock = async () => {
    const res = await googleLogin();
    if (res.success) {
      navigate('/dashboard');
    } else {
      setStatusMsg({ success: false, text: res.message });
    }
  };

  const handleVerificationDone = () => {
    setShowVerificationAlert(false);
    navigate('/dashboard');
  };

  return (
    <div style={{
      padding: '6rem 0',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-gray-light)'
    }}>
      <div className="container" style={{ maxWidth: '450px', width: '100%' }}>
        
        {/* Verification overlay panel */}
        {showVerificationAlert && (
          <div style={{
            padding: '3rem 2.5rem',
            background: '#ffffff',
            textAlign: 'center',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-hover)',
            animation: 'fadeIn 0.4s ease'
          }}>
            <ShieldCheck size={48} color="var(--color-primary)" style={{ marginBottom: '1.25rem' }} />
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>VERIFICATION SENT</h2>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              We have sent a verification code to <strong style={{ color: 'var(--color-black)' }}>{email}</strong>.<br />
              Check your inbox to activate your account.
            </p>
            <button
              onClick={handleVerificationDone}
              className="btn-accent-m"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px' }}
            >
              PROCEED TO DASHBOARD
            </button>
          </div>
        )}

        {/* Auth form panels */}
        {!showVerificationAlert && (
          <div style={{
            padding: '3rem 2.5rem',
            border: '1px solid var(--color-gray-border)',
            borderRadius: 'var(--radius-lg)',
            background: '#ffffff',
            boxShadow: 'var(--shadow-medium)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', letterSpacing: '0.08em', fontWeight: 800, color: 'var(--color-primary)' }}>
                {authMode === 'signin' && 'SIGN IN'}
                {authMode === 'signup' && 'CREATE PROFILE'}
                {authMode === 'forgot' && 'RESET PASSWORD'}
              </h2>
              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem', marginTop: '6px' }}>
                {authMode === 'signin' && 'Sign in to access your orders and wishlist'}
                {authMode === 'signup' && 'Register a new customer profile'}
                {authMode === 'forgot' && 'Recover your account details'}
              </p>
            </div>

            {/* Error / Info messages */}
            {statusMsg.text && (
              <div style={{
                background: statusMsg.success ? 'rgba(3, 166, 133, 0.08)' : 'rgba(255, 29, 64, 0.08)',
                border: `1px solid ${statusMsg.success ? 'var(--color-success)' : '#ff1d40'}`,
                padding: '0.75rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-body)',
                color: statusMsg.success ? 'var(--color-success)' : '#ff1d40',
                marginBottom: '1.5rem',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {statusMsg.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {authMode === 'signup' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Malhotra"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={labelStyle}>
                  EMAIL ADDRESS
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                    required
                  />
                  <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={labelStyle}>
                      PASSWORD
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 700, padding: 0, cursor: 'pointer' }}
                      >
                        FORGOT?
                      </button>
                    )}
                  </div>
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
              )}

              <button type="submit" className="btn-accent-m" style={{ padding: '0.8rem', marginTop: '0.5rem', borderRadius: '4px' }}>
                {authMode === 'signin' && 'SIGN IN'}
                {authMode === 'signup' && 'CREATE PROFILE'}
                {authMode === 'forgot' && 'SEND PASSWORD RESET'}
              </button>
            </form>

            {/* Quick credentials help for user demo */}
            {authMode === 'signin' && (
              <div style={{ marginTop: '1.25rem', background: 'var(--bg-gray-light)', padding: '0.65rem 0.85rem', border: '1px solid var(--color-gray-border)', fontSize: '0.75rem', color: 'var(--color-gray-text)', fontFamily: 'var(--font-body)', textAlign: 'center', borderRadius: '4px', lineHeight: '1.4' }}>
                <strong>Quick Demo:</strong> Enter any email address to sign in instantly (auto-mock database accounts).
              </div>
            )}

            {/* Google authentication mock button */}
            {authMode !== 'forgot' && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleGoogleLoginMock}
                  className="btn-primary-m"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '4px',
                    borderColor: 'var(--color-gray-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-black)'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.706 0 3.277.61 4.5 1.625l2.437-2.437C17.312 1.696 14.933 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.695-.08-1.355-.22-1.955H12.24z"/>
                  </svg>
                  CONTINUE WITH GOOGLE
                </button>
              </div>
            )}

            {/* Toggle Mode button */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
              {authMode === 'signin' && (
                <span>
                  New to MAD MOOD?{' '}
                  <button onClick={() => setAuthMode('signup')} style={toggleBtnStyle}>
                    Register here <ArrowRight size={10} />
                  </button>
                </span>
              )}
              {authMode === 'signup' && (
                <span>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('signin')} style={toggleBtnStyle}>
                    Login here <ArrowRight size={10} />
                  </button>
                </span>
              )}
              {authMode === 'forgot' && (
                <button onClick={() => setAuthMode('signin')} style={toggleBtnStyle}>
                  Return to login <ArrowRight size={10} />
                </button>
              )}
            </div>

          </div>
        )}

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
  marginBottom: '4px',
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

const toggleBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--color-primary)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: '0.8rem',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: 0,
  cursor: 'pointer'
};
