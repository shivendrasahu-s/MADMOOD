import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Phone, User, Check, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export const Verification: React.FC = () => {
  const { currentUser, sendEmailOTP, verifyEmailOTP, sendPhoneOTP, verifyPhoneOTP, updateUserProfile } = useApp();
  const navigate = useNavigate();

  // Get redirect query param
  const queryParams = new URLSearchParams(window.location.search);
  const redirectPath = queryParams.get('redirect') || '/dashboard';

  // Active UI Step: 'email' | 'phone' | 'profile'
  const [activeTab, setActiveTab] = useState<'email' | 'phone' | 'profile'>('email');

  // Email state variables
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  const [emailTimer, setEmailTimer] = useState(0); // in seconds
  const [emailStatus, setEmailStatus] = useState<{ success?: boolean; msg: string } | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);

  // Phone state variables
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0); // in seconds
  const [phoneStatus, setPhoneStatus] = useState<{ success?: boolean; msg: string } | null>(null);
  const [phoneSending, setPhoneSending] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);

  // Profile completion fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [profileStatus, setProfileStatus] = useState<{ success?: boolean; msg: string } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Sync profile values once user loads
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth?redirect=verify');
      return;
    }
    setFirstName(currentUser.firstName || '');
    setLastName(currentUser.lastName || '');
    setPhoneInput(currentUser.phone || '');
    setCity(currentUser.city || '');
    setStateName(currentUser.state || '');
    setPincode(currentUser.pincode || '');

    // Auto navigate to the first uncompleted step
    if (!currentUser.isEmailVerified) {
      setActiveTab('email');
    } else if (!currentUser.isPhoneVerified) {
      setActiveTab('phone');
    } else {
      setActiveTab('profile');
    }
  }, [currentUser, navigate]);

  // Timers countdown
  useEffect(() => {
    let interval: any;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: any;
    if (phoneTimer > 0) {
      interval = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  if (!currentUser) return null;

  // Verification requirements evaluation
  const isEmailDone = !!currentUser.isEmailVerified;
  const isPhoneDone = !!currentUser.isPhoneVerified;
  const isProfileDone = !!(
    currentUser.firstName &&
    currentUser.lastName &&
    currentUser.phone &&
    currentUser.city &&
    currentUser.state &&
    currentUser.pincode &&
    /^\d{6}$/.test(currentUser.pincode)
  );

  const canProceedToCheckout = isEmailDone && isPhoneDone && isProfileDone;

  // Actions
  const handleSendEmailOTP = async () => {
    setEmailSending(true);
    setEmailStatus(null);
    try {
      const res = await sendEmailOTP(currentUser.email);
      if (res.success) {
        setEmailOtpSent(true);
        setEmailTimer(300); // 5 minutes
        setEmailStatus({ success: true, msg: 'Security code successfully dispatched. Check the Mail Simulator or logs.' });
      } else {
        setEmailStatus({ success: false, msg: res.message });
      }
    } catch (e: any) {
      setEmailStatus({ success: false, msg: e.message || 'Transmission failed.' });
    } finally {
      setEmailSending(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCode.trim() || emailCode.length < 6) {
      setEmailStatus({ success: false, msg: 'INPUT ERROR: Please enter the 6-digit security code.' });
      return;
    }
    setEmailVerifying(true);
    setEmailStatus(null);
    try {
      const res = await verifyEmailOTP(currentUser.email, emailCode.trim());
      if (res.success) {
        setEmailStatus({ success: true, msg: 'Email address verified successfully!' });
        // Automatically switch to phone step
        setTimeout(() => {
          setActiveTab('phone');
        }, 1200);
      } else {
        setEmailStatus({ success: false, msg: res.message });
      }
    } catch (e: any) {
      setEmailStatus({ success: false, msg: e.message || 'Verification failure.' });
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleSendPhoneOTP = async () => {
    const cleanPhone = phoneInput.trim();
    if (!cleanPhone || !/^\d{10}$/.test(cleanPhone)) {
      setPhoneStatus({ success: false, msg: 'INPUT ERROR: Enter a valid 10-digit mobile number.' });
      return;
    }
    setPhoneSending(true);
    setPhoneStatus(null);
    try {
      const res = await sendPhoneOTP(cleanPhone);
      if (res.success) {
        setPhoneOtpSent(true);
        setPhoneTimer(300); // 5 minutes
        setPhoneStatus({ success: true, msg: 'OTP sent successfully. Check your browser developer console or simulator.' });
      } else {
        setPhoneStatus({ success: false, msg: res.message });
      }
    } catch (e: any) {
      setPhoneStatus({ success: false, msg: e.message || 'SMS dispatch failed.' });
    } finally {
      setPhoneSending(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCode.trim() || phoneCode.length < 6) {
      setPhoneStatus({ success: false, msg: 'INPUT ERROR: Please enter the 6-digit code.' });
      return;
    }
    setPhoneVerifying(true);
    setPhoneStatus(null);
    try {
      const res = await verifyPhoneOTP(phoneInput.trim(), phoneCode.trim());
      if (res.success) {
        setPhoneStatus({ success: true, msg: 'Phone number verified successfully!' });
        // Automatically switch to profile step
        setTimeout(() => {
          setActiveTab('profile');
        }, 1200);
      } else {
        setPhoneStatus({ success: false, msg: res.message });
      }
    } catch (e: any) {
      setPhoneStatus({ success: false, msg: e.message || 'Phone verification failed.' });
    } finally {
      setPhoneVerifying(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);

    if (!firstName.trim() || !lastName.trim()) {
      setProfileStatus({ success: false, msg: 'INPUT ERROR: First Name and Last Name are required.' });
      return;
    }
    if (!city.trim() || !stateName.trim() || !pincode.trim()) {
      setProfileStatus({ success: false, msg: 'INPUT ERROR: Complete address details (City, State, PIN) are required.' });
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setProfileStatus({ success: false, msg: 'INPUT ERROR: PIN Code must be a 6-digit number.' });
      return;
    }

    setProfileSaving(true);
    try {
      const res = await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
      });

      if (res.success) {
        setProfileStatus({ success: true, msg: 'Profile details activated successfully!' });
      } else {
        setProfileStatus({ success: false, msg: res.message });
      }
    } catch (e: any) {
      setProfileStatus({ success: false, msg: e.message || 'Profile save failed.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div style={{
      padding: '7rem 0 5rem 0',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: '#fafafa',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Main Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#888',
            fontWeight: 600,
            display: 'block',
            marginBottom: '0.5rem'
          }}>Security & Authentication</span>
          <h1 style={{
            fontSize: '2rem',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#111',
            margin: 0
          }}>ACCOUNT ACTIVATION</h1>
          <p style={{
            color: '#666',
            fontSize: '0.85rem',
            marginTop: '0.75rem',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6
          }}>
            To guarantee secure ordering and prevent fraudulent accounts, MAD MOOD requires email verification, SMS verification, and profile completion.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          
          {/* Top Progress bar and summary cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {/* Step 1 Block */}
            <div style={{
              background: '#fff',
              border: `1px solid ${isEmailDone ? '#e0e0e0' : 'rgba(212, 175, 55, 0.4)'}`,
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderLeft: isEmailDone ? '3px solid #10b981' : '3px solid #D4AF37'
            }} onClick={() => setActiveTab('email')}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Step 01</span>
                <h3 style={{ fontSize: '0.9rem', margin: '2px 0 0 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>EMAIL VERIFICATION</h3>
                <span style={{ fontSize: '0.75rem', color: isEmailDone ? '#10b981' : '#888' }}>
                  {isEmailDone ? 'Verified ✓' : 'Pending Action'}
                </span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isEmailDone ? '#ecfdf5' : '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isEmailDone ? <Check size={16} color="#10b981" /> : <Mail size={16} color="#D4AF37" />}
              </div>
            </div>

            {/* Step 2 Block */}
            <div style={{
              background: '#fff',
              border: `1px solid ${isPhoneDone ? '#e0e0e0' : 'rgba(212, 175, 55, 0.4)'}`,
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderLeft: isPhoneDone ? '3px solid #10b981' : '3px solid #D4AF37'
            }} onClick={() => setActiveTab('phone')}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Step 02</span>
                <h3 style={{ fontSize: '0.9rem', margin: '2px 0 0 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PHONE OTP VERIFICATION</h3>
                <span style={{ fontSize: '0.75rem', color: isPhoneDone ? '#10b981' : '#888' }}>
                  {isPhoneDone ? 'Verified ✓' : 'Pending Action'}
                </span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isPhoneDone ? '#ecfdf5' : '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isPhoneDone ? <Check size={16} color="#10b981" /> : <Phone size={16} color="#D4AF37" />}
              </div>
            </div>

            {/* Step 3 Block */}
            <div style={{
              background: '#fff',
              border: `1px solid ${isProfileDone ? '#e0e0e0' : 'rgba(212, 175, 55, 0.4)'}`,
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderLeft: isProfileDone ? '3px solid #10b981' : '3px solid #D4AF37'
            }} onClick={() => setActiveTab('profile')}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Step 03</span>
                <h3 style={{ fontSize: '0.9rem', margin: '2px 0 0 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PROFILE ACTIVATION</h3>
                <span style={{ fontSize: '0.75rem', color: isProfileDone ? '#10b981' : '#888' }}>
                  {isProfileDone ? 'Complete ✓' : 'Incomplete Details'}
                </span>
              </div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isProfileDone ? '#ecfdf5' : '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isProfileDone ? <Check size={16} color="#10b981" /> : <User size={16} color="#D4AF37" />}
              </div>
            </div>
          </div>

          {/* Verification Forms Viewport */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #111',
            padding: '2.5rem',
            minHeight: '350px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Step 1: Email View */}
            {activeTab === 'email' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <Mail size={22} color="#111" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    EMAIL ADDRESS VERIFICATION
                  </h2>
                </div>

                {isEmailDone ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', marginBottom: '1rem' }}>
                      <Check size={28} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 0.5rem 0' }}>EMAIL ADDRESS VERIFIED</h3>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>
                      Your email <strong style={{ color: '#111' }}>{currentUser.email}</strong> is secured and verified.
                    </p>
                    <button
                      onClick={() => setActiveTab('phone')}
                      className="btn-accent-m"
                      style={{
                        backgroundColor: '#111',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        marginTop: '1.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      Proceed to Step 2 <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
                      We must verify that you own <strong style={{ color: '#111' }}>{currentUser.email}</strong> before proceeding.
                      Click below to receive a security OTP.
                    </p>

                    {!emailOtpSent ? (
                      <button
                        onClick={handleSendEmailOTP}
                        disabled={emailSending}
                        style={{
                          backgroundColor: '#111',
                          color: '#fff',
                          border: 'none',
                          padding: '0.75rem 2rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          borderRadius: '0px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          opacity: emailSending ? 0.6 : 1
                        }}
                      >
                        {emailSending ? <RefreshCw size={14} className="animate-spin" /> : null}
                        {emailSending ? 'GENERATING CODE...' : 'SEND VERIFICATION CODE'}
                      </button>
                    ) : (
                      <form onSubmit={handleVerifyEmail}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.5rem' }}>
                            ENTER 6-DIGIT CODE
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                            style={{
                              width: '100%',
                              maxWidth: '240px',
                              padding: '0.75rem 1rem',
                              border: '1px solid #111',
                              borderRadius: '0px',
                              fontSize: '1.1rem',
                              letterSpacing: '0.3em',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontFamily: 'monospace'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <button
                            type="submit"
                            disabled={emailVerifying || emailCode.length !== 6}
                            style={{
                              backgroundColor: '#111',
                              color: '#fff',
                              border: 'none',
                              padding: '0.75rem 2rem',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              borderRadius: '0px',
                              cursor: emailCode.length === 6 ? 'pointer' : 'not-allowed',
                              opacity: emailCode.length === 6 && !emailVerifying ? 1 : 0.6
                            }}
                          >
                            {emailVerifying ? 'VERIFYING...' : 'VERIFY CODE'}
                          </button>

                          {emailTimer > 0 ? (
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                              Resend code in <strong>{formatTimer(emailTimer)}</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendEmailOTP}
                              disabled={emailSending}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#D4AF37',
                                textDecoration: 'underline',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              Resend Verification Email
                            </button>
                          )}
                        </div>
                      </form>
                    )}

                    {emailStatus && (
                      <div style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: emailStatus.success ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${emailStatus.success ? '#bbf7d0' : '#fecaca'}`,
                        color: emailStatus.success ? '#166534' : '#991b1b',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {emailStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                        <span>{emailStatus.msg}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Phone View */}
            {activeTab === 'phone' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <Phone size={22} color="#111" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    PHONE NUMBER OTP VERIFICATION
                  </h2>
                </div>

                {isPhoneDone ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ecfdf5', marginBottom: '1rem' }}>
                      <Check size={28} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 0.5rem 0' }}>PHONE NUMBER VERIFIED</h3>
                    <p style={{ color: '#666', fontSize: '0.85rem' }}>
                      Your phone number <strong style={{ color: '#111' }}>{currentUser.phone}</strong> is verified.
                    </p>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="btn-accent-m"
                      style={{
                        backgroundColor: '#111',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        marginTop: '1.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      Proceed to Step 3 <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
                      A verified phone number is required to coordinate delivery dispatch alerts and Cash on Delivery orders.
                    </p>

                    {!phoneOtpSent ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.5rem' }}>
                            MOBILE NUMBER (10 DIGITS)
                          </label>
                          <div style={{ display: 'flex', border: '1px solid #111', borderRadius: '0px', overflow: 'hidden' }}>
                            <span style={{
                              padding: '0.75rem 1rem',
                              backgroundColor: '#eee',
                              color: '#111',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              borderRight: '1px solid #111',
                              display: 'flex',
                              alignItems: 'center'
                            }}>+91</span>
                            <input
                              type="text"
                              maxLength={10}
                              placeholder="9876543210"
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                              style={{
                                flex: 1,
                                padding: '0.75rem 1rem',
                                border: 'none',
                                fontSize: '0.85rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={handleSendPhoneOTP}
                          disabled={phoneSending || phoneInput.length !== 10}
                          style={{
                            backgroundColor: '#111',
                            color: '#fff',
                            border: 'none',
                            padding: '0.75rem 2rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            borderRadius: '0px',
                            cursor: phoneInput.length === 10 ? 'pointer' : 'not-allowed',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: phoneInput.length === 10 && !phoneSending ? 1 : 0.6
                          }}
                        >
                          {phoneSending ? 'DISPATCHING SMS...' : 'SEND OTP VIA SMS'}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyPhone}>
                        <div style={{ marginBottom: '1.5rem' }}>
                          <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
                            OTP sent to <strong>+91 {phoneInput}</strong>.{' '}
                            <button
                              type="button"
                              onClick={() => setPhoneOtpSent(false)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#D4AF37',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: 0
                              }}
                            >
                              Edit Phone
                            </button>
                          </p>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.5rem' }}>
                            ENTER 6-DIGIT OTP
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                            style={{
                              width: '100%',
                              maxWidth: '240px',
                              padding: '0.75rem 1rem',
                              border: '1px solid #111',
                              borderRadius: '0px',
                              fontSize: '1.1rem',
                              letterSpacing: '0.3em',
                              textAlign: 'center',
                              fontWeight: 700,
                              fontFamily: 'monospace'
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <button
                            type="submit"
                            disabled={phoneVerifying || phoneCode.length !== 6}
                            style={{
                              backgroundColor: '#111',
                              color: '#fff',
                              border: 'none',
                              padding: '0.75rem 2rem',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              borderRadius: '0px',
                              cursor: phoneCode.length === 6 ? 'pointer' : 'not-allowed',
                              opacity: phoneCode.length === 6 && !phoneVerifying ? 1 : 0.6
                            }}
                          >
                            {phoneVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
                          </button>

                          {phoneTimer > 0 ? (
                            <span style={{ fontSize: '0.8rem', color: '#666' }}>
                              Resend code in <strong>{formatTimer(phoneTimer)}</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendPhoneOTP}
                              disabled={phoneSending}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#D4AF37',
                                textDecoration: 'underline',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                padding: 0
                              }}
                            >
                              Resend OTP SMS
                            </button>
                          )}
                        </div>
                      </form>
                    )}

                    {phoneStatus && (
                      <div style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: phoneStatus.success ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${phoneStatus.success ? '#bbf7d0' : '#fecaca'}`,
                        color: phoneStatus.success ? '#166534' : '#991b1b',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {phoneStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                        <span>{phoneStatus.msg}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Profile Completion */}
            {activeTab === 'profile' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                  <User size={22} color="#111" />
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    PROFILE ACTIVATION DETAILS
                  </h2>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                    Provide your basic details and billing/delivery regional code mapping to finish activating your customer profile.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                        FIRST NAME
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #111',
                          borderRadius: '0px',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                        LAST NAME
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #111',
                          borderRadius: '0px',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                      PHONE (VERIFIED)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser.phone || phoneInput}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        border: '1px solid #ccc',
                        backgroundColor: '#f5f5f5',
                        color: '#666',
                        borderRadius: '0px',
                        fontSize: '0.85rem',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                        PINCODE
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="209801"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #111',
                          borderRadius: '0px',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                        CITY
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Unnao"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #111',
                          borderRadius: '0px',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', display: 'block', marginBottom: '0.25rem' }}>
                        STATE
                      </label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Uttar Pradesh"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          border: '1px solid #111',
                          borderRadius: '0px',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    style={{
                      backgroundColor: '#111',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      borderRadius: '0px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '1rem',
                      opacity: profileSaving ? 0.6 : 1
                    }}
                  >
                    {profileSaving ? 'ACTIVATING...' : 'SAVE & COMPLETED DETAILS'}
                  </button>

                  {profileStatus && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: profileStatus.success ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${profileStatus.success ? '#bbf7d0' : '#fecaca'}`,
                      color: profileStatus.success ? '#166534' : '#991b1b',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {profileStatus.success ? <Check size={14} /> : <AlertCircle size={14} />}
                      <span>{profileStatus.msg}</span>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Bottom Actions Row: If profile verification is fully activated, let the user proceed */}
            <div style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                {canProceedToCheckout ? (
                  <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={16} /> PROFILE FULLY SECURED & ACTIVATED
                  </span>
                ) : (
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>
                    Complete all 3 steps above to checkout.
                  </span>
                )}
              </div>

              <button
                disabled={!canProceedToCheckout}
                onClick={() => navigate(redirectPath)}
                style={{
                  backgroundColor: canProceedToCheckout ? '#D4AF37' : '#ccc',
                  color: canProceedToCheckout ? '#111' : '#fff',
                  border: 'none',
                  padding: '1rem 2.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  borderRadius: '0px',
                  cursor: canProceedToCheckout ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease'
                }}
              >
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
