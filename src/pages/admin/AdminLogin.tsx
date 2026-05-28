import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isFirebaseEnabled, auth } from '../../services/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { sendEmail } from '../../services/db';
import { ShieldCheck, Mail, Lock, ArrowRight, KeyRound, RefreshCw } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | 'otp' | 'forgot'>('login');
  
  // OTP Verification states
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(0);
  
  // Feedback states
  const [statusMsg, setStatusMsg] = useState({ success: true, text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const adminSession = sessionStorage.getItem('mmi_admin_authenticated');
    const adminEmail = sessionStorage.getItem('mmi_admin_email');
    if (adminSession === 'true' && adminEmail === 'shivendrasahu003@gmail.com') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ success: true, text: '' });

    const normalizedEmail = email.trim().toLowerCase();

    // STRICT ACCESS LOGIC CHECK
    if (normalizedEmail !== 'shivendrasahu003@gmail.com') {
      setStatusMsg({
        success: false,
        text: 'ACCESS DENIED: Unauthorized Administrator Email.'
      });
      setLoading(false);
      return;
    }

    // Initialize OTP Generation
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    if (isFirebaseEnabled && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        
        // Secondary verification of user email in case of Firebase rule discrepancies
        if (userCredential.user.email?.toLowerCase() !== 'shivendrasahu003@gmail.com') {
          await signOut(auth);
          setStatusMsg({
            success: false,
            text: 'ACCESS DENIED: Credentials verified but email is unauthorized.'
          });
          setLoading(false);
          return;
        }

        setGeneratedOtp(newOtp);
        setTimer(60);
        
        // Dispatch OTP via the mail service
        await sendEmail(
          normalizedEmail,
          'MADMOOD SECURITY // ADMIN PANEL 2FA OTP',
          `<div style="font-family: sans-serif; padding: 2rem; border: 1px solid #eee; max-width: 600px;">
            <h2 style="color: #000; letter-spacing: 0.1em; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">MAD MOOD SECURITY GATEWAY</h2>
            <p>A sign-in request was initiated for the Admin Dashboard at ${new Date().toLocaleString()}.</p>
            <p style="font-size: 1.1rem; color: #555;">Use the following 6-digit verification code to complete sign-in:</p>
            <div style="background: #f8f9fa; border: 1px solid #ddd; padding: 1.5rem; text-align: center; font-size: 2.25rem; font-weight: 800; letter-spacing: 0.25em; color: #000; margin: 1.5rem 0;">
              ${newOtp}
            </div>
            <p style="font-size: 0.8rem; color: #999;">If you did not initiate this request, please change your credentials immediately.</p>
          </div>`
        );

        setStep('otp');
        setStatusMsg({ success: true, text: 'OTP sent to shivendrasahu003@gmail.com.' });
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
      setTimeout(async () => {
        if (normalizedEmail === 'shivendrasahu003@gmail.com' && password === 'admin123') {
          setGeneratedOtp(newOtp);
          setTimer(60);
          
          await sendEmail(
            normalizedEmail,
            'MADMOOD SECURITY // ADMIN PANEL 2FA OTP (SIMULATED)',
            `<div style="font-family: sans-serif; padding: 2rem; border: 1px solid #eee; max-width: 600px;">
              <h2 style="color: #000; letter-spacing: 0.1em; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">MAD MOOD SIMULATED SECURITY GATEWAY</h2>
              <p>A mock sign-in request was initiated for the Admin Dashboard.</p>
              <p style="font-size: 1.1rem; color: #555;">Use the following 6-digit verification code to complete sign-in:</p>
              <div style="background: #f8f9fa; border: 1px solid #ddd; padding: 1.5rem; text-align: center; font-size: 2.25rem; font-weight: 800; letter-spacing: 0.25em; color: #000; margin: 1.5rem 0;">
                ${newOtp}
              </div>
              <p style="font-size: 0.8rem; color: #999;">Simulation Mode Active. No real Firebase check executed.</p>
            </div>`
          );

          setStep('otp');
          setStatusMsg({ success: true, text: 'Simulated OTP sent to shivendrasahu003@gmail.com.' });
        } else {
          setStatusMsg({ 
            success: false, 
            text: 'MOCK AUTH FAILED: Enter email shivendrasahu003@gmail.com and password admin123.' 
          });
        }
        setLoading(false);
      }, 800);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setStatusMsg({ success: true, text: '' });
    const normalizedEmail = email.trim().toLowerCase();
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setTimer(60);

    try {
      await sendEmail(
        normalizedEmail,
        'MADMOOD SECURITY // ADMIN PANEL 2FA OTP',
        `<div style="font-family: sans-serif; padding: 2rem; border: 1px solid #eee; max-width: 600px;">
          <h2 style="color: #000; letter-spacing: 0.1em; border-bottom: 2px solid #000; padding-bottom: 0.5rem;">MAD MOOD SECURITY GATEWAY</h2>
          <p>A sign-in request was initiated for the Admin Dashboard at ${new Date().toLocaleString()}.</p>
          <p style="font-size: 1.1rem; color: #555;">Use the following 6-digit verification code to complete sign-in:</p>
          <div style="background: #f8f9fa; border: 1px solid #ddd; padding: 1.5rem; text-align: center; font-size: 2.25rem; font-weight: 800; letter-spacing: 0.25em; color: #000; margin: 1.5rem 0;">
            ${newOtp}
          </div>
          <p style="font-size: 0.8rem; color: #999;">If you did not initiate this request, please change your credentials immediately.</p>
        </div>`
      );
      setStatusMsg({ success: true, text: 'A new security token has been dispatched.' });
    } catch (error: any) {
      setStatusMsg({ success: false, text: 'Failed to resend OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (otpInput.trim() === generatedOtp) {
      // Establish session
      sessionStorage.setItem('mmi_admin_authenticated', 'true');
      sessionStorage.setItem('mmi_admin_email', 'shivendrasahu003@gmail.com');
      
      // Auto-save persistent log
      localStorage.setItem('mmi_admin_persistent_email', 'shivendrasahu003@gmail.com');
      
      navigate('/admin/dashboard');
    } else {
      setStatusMsg({ success: false, text: 'VERIFICATION FAILED: Invalid 6-digit OTP code.' });
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ success: true, text: '' });

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== 'shivendrasahu003@gmail.com') {
      setStatusMsg({ success: false, text: 'ACCESS DENIED: Email is not registered as admin.' });
      setLoading(false);
      return;
    }

    if (isFirebaseEnabled && auth) {
      try {
        await sendPasswordResetEmail(auth, normalizedEmail);
        setStatusMsg({ success: true, text: 'RESET SUCCESSFUL: Real Firebase reset link sent to your email.' });
        setTimeout(() => setStep('login'), 3000);
      } catch (error: any) {
        setStatusMsg({ success: false, text: error.message || 'Error sending reset email.' });
      } finally {
        setLoading(false);
      }
    } else {
      // Simulated Reset Email
      setTimeout(async () => {
        await sendEmail(
          normalizedEmail,
          'MADMOOD ACCESS // ADMIN PASSWORD RESET REQUEST',
          `<h2>MAD MOOD ACCOUNT SERVICES</h2>
           <p>We received a password reset request for admin account shivendrasahu003@gmail.com.</p>
           <p>This is a simulated password reset link for local development:</p>
           <a href="#reset" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; display: inline-block;">RESET ADMIN PASSWORD</a>`
        );
        setStatusMsg({ success: true, text: 'MOCK SUCCESS: Password reset link dispatched to your email.' });
        setTimeout(() => setStep('login'), 3000);
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
        
        {/* Environment status banner */}
        <div style={{
          background: '#000000',
          border: '1px solid #111111',
          color: '#a3a3a3',
          padding: '0.85rem 1.25rem',
          fontSize: '0.7rem',
          fontWeight: 500,
          borderRadius: '0px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          lineHeight: '1.4',
          letterSpacing: '0.02em'
        }}>
          <ShieldCheck size={14} color="var(--color-gold)" style={{ flexShrink: 0 }} />
          <span>
            {isFirebaseEnabled ? (
              <strong>MADMOOD SECURE CORE: Firebase Authentication gateway active.</strong>
            ) : (
              <strong>MADMOOD SECURE CORE: Simulation Mode Active (email: shivendrasahu003@gmail.com / pwd: admin123).</strong>
            )}
          </span>
        </div>

        <div style={{
          padding: '3rem 2.5rem',
          border: '1px solid var(--color-gray-border)',
          borderRadius: '0px', // Sharp luxury edges
          background: '#ffffff',
          boxShadow: 'var(--shadow-medium)'
        }}>
          
          {/* STEP 1: CREDENTIAL LOGIN */}
          {step === 'login' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                <ShieldCheck size={40} color="var(--color-black)" style={{ marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
                <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>
                  MADMOOD GATEWAY
                </h2>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', marginTop: '6px' }}>
                  Restricted Access. Administrator credentials required.
                </p>
              </div>

              {statusMsg.text && (
                <div style={{
                  background: statusMsg.success ? 'rgba(43, 138, 62, 0.08)' : 'rgba(255, 29, 64, 0.08)',
                  border: `1px solid ${statusMsg.success ? 'var(--color-success)' : '#ff1d40'}`,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: statusMsg.success ? 'var(--color-success)' : '#ff1d40',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>ADMINISTRATOR EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="shivendrasahu003@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      required
                    />
                    <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>SECURITY PASSWORD</label>
                    <button 
                      type="button" 
                      onClick={() => setStep('forgot')}
                      style={{ background: 'none', border: 'none', color: 'var(--color-gray-text)', fontSize: '0.65rem', textDecoration: 'underline', padding: 0, cursor: 'pointer' }}
                    >
                      FORGOT PASSWORD?
                    </button>
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

                <button 
                  type="submit" 
                  className="btn-primary-m hover-trigger" 
                  style={{ padding: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'VERIFYING CREDENTIALS...' : 'REQUEST 2FA OTP'} <ArrowRight size={14} />
                </button>
              </form>
            </>
          )}

          {/* STEP 2: 2FA OTP VERIFICATION */}
          {step === 'otp' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                <KeyRound size={40} color="var(--color-gold)" style={{ marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
                <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>
                  OTP CONFIRMATION
                </h2>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', marginTop: '6px' }}>
                  A one-time security token has been generated. Enter the 6-digit code.
                </p>
              </div>

              {statusMsg.text && (
                <div style={{
                  background: statusMsg.success ? 'rgba(43, 138, 62, 0.08)' : 'rgba(255, 29, 64, 0.08)',
                  border: `1px solid ${statusMsg.success ? 'var(--color-success)' : '#ff1d40'}`,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: statusMsg.success ? 'var(--color-success)' : '#ff1d40',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>6-DIGIT VERIFICATION CODE</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.25em', fontWeight: 'bold' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-accent-m hover-trigger" 
                  style={{ padding: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'CONFIRMING...' : 'AUTHORIZE SESSION'} <ShieldCheck size={14} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setStep('login');
                      setStatusMsg({ success: true, text: '' });
                    }} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-gray-text)', fontSize: '0.7rem', textDecoration: 'underline', padding: 0, cursor: 'pointer' }}
                  >
                    Back to Login
                  </button>

                  <button 
                    type="button" 
                    disabled={timer > 0 || loading}
                    onClick={handleResendOtp}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: timer > 0 ? 'var(--color-gray-text)' : 'var(--color-black)', 
                      fontSize: '0.7rem', 
                      fontWeight: 600,
                      textDecoration: timer > 0 ? 'none' : 'underline', 
                      padding: 0, 
                      cursor: timer > 0 ? 'default' : 'pointer' 
                    }}
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP Code'}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* STEP 3: FORGOT PASSWORD */}
          {step === 'forgot' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                <KeyRound size={40} color="var(--color-black)" style={{ marginBottom: '0.75rem', marginLeft: 'auto', marginRight: 'auto' }} />
                <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', fontWeight: 800, color: 'var(--color-black)', fontFamily: 'var(--font-heading)' }}>
                  ACCOUNT RESET
                </h2>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', marginTop: '6px' }}>
                  Provide the registered admin email to receive reset links.
                </p>
              </div>

              {statusMsg.text && (
                <div style={{
                  background: statusMsg.success ? 'rgba(43, 138, 62, 0.08)' : 'rgba(255, 29, 64, 0.08)',
                  border: `1px solid ${statusMsg.success ? 'var(--color-success)' : '#ff1d40'}`,
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: statusMsg.success ? 'var(--color-success)' : '#ff1d40',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>ADMINISTRATOR EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="shivendrasahu003@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                      required
                    />
                    <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary-m hover-trigger" 
                  style={{ padding: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                  disabled={loading}
                >
                  {loading ? 'SENDING RESET EMAIL...' : 'DISPATCH RESET LINK'} <RefreshCw size={14} />
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    setStep('login');
                    setStatusMsg({ success: true, text: '' });
                  }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-gray-text)', fontSize: '0.7rem', textDecoration: 'underline', padding: 0, marginTop: '0.5rem', cursor: 'pointer' }}
                >
                  Return to Login Screen
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-black)',
  fontWeight: 700,
  marginBottom: '6px',
  letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '0.7rem 0.85rem',
  color: '#000000',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box'
};
export default AdminLogin;
