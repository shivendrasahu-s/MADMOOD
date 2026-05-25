import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp, Phone, MapPin, Compass } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // FAQ Accordion State
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('REQUIRED FIELD CHECK: Please fill in all query fields.');
      return;
    }
    setName('');
    setEmail('');
    setMessage('');
    alert('MESSAGE SENT: We will get back to you shortly.');
  };

  const faqs = [
    {
      q: 'HOW DO I TRACK MY ACTIVE ORDER?',
      a: 'Once your payment is successful, an order ID (e.g. MM-IND-123456) will be generated. Go to the Order Tracking page to track shipment dispatch and delivery status.'
    },
    {
      q: 'WHAT SIZE PARAMETERS ARE THE OVERSIZED PRODUCTS CUT TO?',
      a: 'Our oversized items are engineered with dropped shoulders and a boxy wide silhouette. We recommend selecting your true size. If you prefer a closer standard fit, size down by one size.'
    },
    {
      q: 'WHAT IS THE RETURN POLICY?',
      a: 'We accept returns on all unused and unworn items with original tags intact within 14 days of delivery.'
    }
  ];

  return (
    <div style={{ padding: '4rem 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--color-red)', letterSpacing: '0.2em' }}>
            CONTACT US
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '4px', letterSpacing: '0.05em' }}>GET IN TOUCH</h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--color-red)', margin: '1rem auto' }} />
        </div>

        {/* Core Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginBottom: '6rem' }} className="contact-grid">
          
          {/* Dispatch Message form */}
          <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              SEND A MESSAGE
            </h2>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>YOUR NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>QUERY CONTENT</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-premium-red hover-trigger"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={14} /> SEND MESSAGE
              </button>
            </form>
          </div>

          {/* Location indexes & Coordinates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Headquarters details */}
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <MapPin size={18} color="var(--color-red)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-header)', letterSpacing: '0.05em' }}>HEADQUARTERS</h3>
              </div>
              <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--color-white)', fontSize: '0.9rem', marginBottom: '4px' }}>UNNAO CAMPUS</h4>
                <p style={{ color: 'var(--color-silver-light)', margin: 0 }}>Unnao, Uttar Pradesh, India</p>
                <p style={{ color: 'var(--color-silver)', margin: 0 }}>PIN Code: 209801</p>
              </div>
            </div>

            {/* Customer Support */}
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Phone size={18} color="var(--color-red)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-header)', letterSpacing: '0.05em' }}>CUSTOMER SUPPORT</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <p style={{ color: 'var(--color-silver)', marginBottom: '2px', fontSize: '0.75rem' }}>DIRECT PHONE LINE</p>
                  <a href="tel:+916386376901" className="hover-trigger" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-white)', textDecoration: 'none', letterSpacing: '0.05em', transition: '0.3s' }}>
                    +91 6386376901
                  </a>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                  <p style={{ color: 'var(--color-silver)', marginBottom: '2px', fontSize: '0.75rem' }}>SUPPORT EMAIL</p>
                  <a href="mailto:support@madmood.clothing" className="hover-trigger" style={{ color: 'var(--color-silver-light)', textDecoration: 'none', transition: '0.3s' }}>
                    support@madmood.clothing
                  </a>
                </div>
              </div>
            </div>

            {/* Corporate Ownership */}
            <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Compass size={18} color="var(--color-red)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--color-white)', margin: 0, fontFamily: 'var(--font-header)', letterSpacing: '0.05em' }}>BUSINESS METRICS</h3>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-silver-light)', fontFamily: 'var(--font-header)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--color-silver)' }}>POWERED BY //</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--color-white)' }}>Mr. Pushpendra Sahu</p>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--color-white)' }}>Mr. Shivendra Sahu</p>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-white)' }}>Mr. Dipendra Sahu</p>
              </div>
            </div>

            {/* Tactical Interactive Map mockup */}
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-red)', fontWeight: 800, fontFamily: 'var(--font-header)', letterSpacing: '0.15em' }}>HQ MAP DIRECTORY //</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)' }}>26.4670° N, 80.4900° E</span>
              </div>
              
              <div style={{
                width: '100%',
                height: '180px',
                background: 'radial-gradient(circle at 50% 50%, #151515, #000)',
                border: '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* SVG Tactical Grid Lines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.15 }}>
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Stylized Map Coordinates Indicator */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Blinking Beacon */}
                  <div className="beacon" style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--color-red)',
                    borderRadius: '50%',
                    position: 'relative',
                    boxShadow: '0 0 15px var(--color-red)',
                    animation: 'pulse 1.8s infinite'
                  }} />
                  <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.75rem', fontWeight: 900, marginTop: '8px', color: '#fff', letterSpacing: '0.1em' }}>UNNAO, IN</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-silver)', marginTop: '2px' }}>CORPORATE DEPOT</span>
                </div>
              </div>
              
              {/* CSS Keyframes for tactical pulse */}
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 0 0 rgba(255, 13, 43, 0.7); }
                  70% { transform: scale(1.1); opacity: 0.4; box-shadow: 0 0 0 10px rgba(255, 13, 43, 0); }
                  100% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 0 0 rgba(255, 13, 43, 0); }
                }
              `}</style>
            </div>

          </div>
        </div>

        {/* FAQs collapsible list */}
        <section style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '0.1em' }}>
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel hover-trigger"
                  style={{
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <button
                    onClick={() => setActiveFaqIdx(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: '1.25rem 1.5rem',
                      color: 'var(--color-white)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'var(--font-header)',
                      fontSize: '0.8rem',
                      textAlign: 'left'
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} color="var(--color-red)" /> : <ChevronDown size={16} />}
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--color-silver)',
                      lineHeight: '1.6',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-header)',
  color: 'var(--color-silver)',
  marginBottom: '4px',
  letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-black)',
  border: '1px solid rgba(255,255,255,0.15)',
  padding: '0.6rem',
  color: 'var(--color-white)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.8rem',
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box'
};
