import React, { useState, useEffect } from 'react';
import { 
  getBannersSettings, 
  saveBannersSettings,
  getAnnouncements,
  saveAnnouncements,
  getCoupons,
  saveCoupons,
  getPopupSettings,
  savePopupSettings,
  type BannerSlide,
  type Coupon,
  type PopupSettings
} from '../../services/db';
import { Trash2, Save, Tag, Volume2, Sliders, Layout } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'announcements' | 'coupons' | 'popup'>('banners');
  
  // Settings States
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [popup, setPopup] = useState<PopupSettings | null>(null);

  // New Coupon Form States
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'fixed' | 'percent'>('fixed');
  const [newValue, setNewValue] = useState(100);
  const [newMin, setNewMin] = useState(0);

  // New Announcement State
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const loadSettings = () => {
    setBanners(getBannersSettings());
    setAnnouncements(getAnnouncements());
    setCoupons(getCoupons());
    setPopup(getPopupSettings());
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Banners updates
  const handleBannerChange = (idx: number, field: keyof BannerSlide, val: string) => {
    const updated = [...banners];
    updated[idx] = { ...updated[idx], [field]: val };
    setBanners(updated);
  };

  const handleSaveBanners = () => {
    try {
      saveBannersSettings(banners);
      alert('HOMEPAGE SLIDESHOW CONFIGURATION SAVED AND DEPLOYED');
      loadSettings();
    } catch (e: any) {
      alert('ERROR: ' + e.message);
    }
  };

  // Announcements updates
  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    const updated = [...announcements, newAnnouncement.trim().toUpperCase()];
    setAnnouncements(updated);
    saveAnnouncements(updated);
    setNewAnnouncement('');
    alert('ANNOUNCEMENT REGISTERED: Header alerts refreshed.');
  };

  const handleDeleteAnnouncement = (idx: number) => {
    const updated = announcements.filter((_, i) => i !== idx);
    setAnnouncements(updated);
    saveAnnouncements(updated);
    alert('ANNOUNCEMENT REMOVED');
  };

  // Coupons updates
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCode.trim().toUpperCase();
    if (!code) return;
    
    if (coupons.some(c => c.code === code)) {
      alert('ERROR: Coupon code already active.');
      return;
    }

    const payload: Coupon = {
      code,
      type: newType,
      value: Number(newValue),
      minPurchase: Number(newMin),
      isActive: true
    };

    const updated = [...coupons, payload];
    setCoupons(updated);
    saveCoupons(updated);
    
    setNewCode('');
    setNewValue(100);
    setNewMin(0);
    alert(`COUPON ${code} CREATED AND ACTIVE`);
  };

  const handleToggleCoupon = (code: string) => {
    const updated = coupons.map(c => 
      c.code === code ? { ...c, isActive: !c.isActive } : c
    );
    setCoupons(updated);
    saveCoupons(updated);
  };

  const handleDeleteCoupon = (code: string) => {
    if (window.confirm(`Delete coupon ${code}?`)) {
      const updated = coupons.filter(c => c.code !== code);
      setCoupons(updated);
      saveCoupons(updated);
      alert('COUPON EXPIRED');
    }
  };

  // Popup updates
  const handlePopupChange = (field: keyof PopupSettings, val: any) => {
    if (!popup) return;
    setPopup({ ...popup, [field]: val });
  };

  const handleSavePopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popup) return;
    savePopupSettings(popup);
    alert('NEWSLETTER REGISTER MODAL SETTINGS COMMITTED');
    loadSettings();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-heading)' }}>WEBSITE CONTROLS</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>Configure promotional tools, alert headers, and homepage display layers.</p>
        </div>
      </div>

      {/* CONTROLS MENU BAR */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--admin-border)',
        gap: '4px',
        overflowX: 'auto'
      }}>
        <button 
          onClick={() => setActiveTab('banners')} 
          style={{ ...tabBtnStyle, borderBottomColor: activeTab === 'banners' ? 'var(--admin-accent)' : 'transparent', color: activeTab === 'banners' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}
        >
          <Sliders size={14} /> Hero Slides ({banners.length})
        </button>
        <button 
          onClick={() => setActiveTab('announcements')} 
          style={{ ...tabBtnStyle, borderBottomColor: activeTab === 'announcements' ? 'var(--admin-accent)' : 'transparent', color: activeTab === 'announcements' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}
        >
          <Volume2 size={14} /> Announcements ({announcements.length})
        </button>
        <button 
          onClick={() => setActiveTab('coupons')} 
          style={{ ...tabBtnStyle, borderBottomColor: activeTab === 'coupons' ? 'var(--admin-accent)' : 'transparent', color: activeTab === 'coupons' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}
        >
          <Tag size={14} /> Coupons ({coupons.length})
        </button>
        <button 
          onClick={() => setActiveTab('popup')} 
          style={{ ...tabBtnStyle, borderBottomColor: activeTab === 'popup' ? 'var(--admin-accent)' : 'transparent', color: activeTab === 'popup' ? 'var(--admin-accent)' : 'var(--admin-text-secondary)' }}
        >
          <Layout size={14} /> Popup Settings
        </button>
      </div>

      {/* MAIN SETTINGS PANE */}
      <div style={{
        background: 'var(--admin-card-bg)',
        border: '1px solid var(--admin-border)',
        padding: '2rem'
      }}>
        
        {/* 1. BANNERS EDITOR */}
        {activeTab === 'banners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <h3 style={panelTitleStyle}>HERO SLIDESHOW ARRAY</h3>
              <button 
                onClick={handleSaveBanners}
                style={saveBtnStyle}
                className="hover-trigger"
              >
                <Save size={14} /> DEPLOY HERO LAYOUT
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {banners.map((slide, idx) => (
                <div key={idx} style={{
                  border: '1px solid var(--admin-border)',
                  padding: '1.5rem',
                  backgroundColor: 'var(--admin-bg)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '1.5rem'
                }}>
                  {/* Left preview and index */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--admin-accent)' }}>SLIDE CODE NODE #{idx + 1}</span>
                    <div style={{ width: '100%', height: '140px', background: '#000', overflow: 'hidden', border: '1px solid var(--admin-border)' }}>
                      <img src={slide.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=300'; }} />
                    </div>
                  </div>

                  {/* Fields */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={labelStyle}>HEADER TAG (SUBTITLE)</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => handleBannerChange(idx, 'subtitle', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>SLIDE TITLE (HERO)</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleBannerChange(idx, 'title', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>SLIDE DESCRIPTION</label>
                      <input
                        type="text"
                        value={slide.description}
                        onChange={(e) => handleBannerChange(idx, 'description', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={labelStyle}>UNSPLASH HERO IMAGE URL</label>
                        <input
                          type="url"
                          value={slide.image}
                          onChange={(e) => handleBannerChange(idx, 'image', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>REDIRECT DESTINATION (LINK)</label>
                        <input
                          type="text"
                          value={slide.link}
                          onChange={(e) => handleBannerChange(idx, 'link', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ANNOUNCEMENTS EDITOR */}
        {activeTab === 'announcements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={panelTitleStyle}>TOP HEADER ANNOUNCEMENT BAR</h3>
            
            {/* Create form */}
            <form onSubmit={handleAddAnnouncement} style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1.5rem' }}>
              <div style={{ flexGrow: 1 }}>
                <label style={labelStyle}>NEW HEADER SCROLL MESSAGE</label>
                <input
                  type="text"
                  placeholder="e.g. GET EXTRA 10% DISCOUNT ON ALL UPI PREPAID ORDERS..."
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <button 
                type="submit" 
                style={{ 
                  background: 'var(--admin-primary)', 
                  color: 'var(--admin-bg)', 
                  border: 'none', 
                  padding: '10px 20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  alignSelf: 'flex-end', 
                  cursor: 'pointer' 
                }}
              >
                + ADD ALERT
              </button>
            </form>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {announcements.map((ann, idx) => (
                <div key={idx} style={{
                  border: '1px solid var(--admin-border)',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  backgroundColor: 'var(--admin-bg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--admin-accent)' }}>●</span>
                    <span style={{ fontWeight: 600 }}>{ann}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteAnnouncement(idx)}
                    style={{ background: 'none', border: 'none', color: '#ff1d40', cursor: 'pointer' }}
                    title="Remove announcement"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. COUPONS EDITOR */}
        {activeTab === 'coupons' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={panelTitleStyle}>DISCOUNT COUPONS SYSTEM</h3>
            
            {/* Create Coupon form */}
            <form onSubmit={handleAddCoupon} style={{
              background: 'var(--admin-bg)',
              border: '1px solid var(--admin-border)',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'flex-end'
            }}>
              <div>
                <label style={labelStyle}>COUPON CODE</label>
                <input
                  type="text"
                  placeholder="e.g. FESTIVE500"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>DISCOUNT TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  style={{ ...inputStyle, height: '36px', cursor: 'pointer' }}
                >
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>DISCOUNT VALUE</label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(Number(e.target.value))}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>MIN PURCHASE VALUE (₹)</label>
                <input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(Number(e.target.value))}
                  style={inputStyle}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  background: 'var(--admin-primary)', 
                  color: 'var(--admin-bg)', 
                  border: 'none', 
                  padding: '10px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  height: '36px'
                }}
              >
                + DEPLOY COUPON
              </button>
            </form>

            {/* Dynamic Coupon table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--admin-border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
                    <th style={thStyle}>COUPON CODE</th>
                    <th style={thStyle}>TYPE</th>
                    <th style={thStyle}>BENEFIT</th>
                    <th style={thStyle}>MINIMUM CART VALUE</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.code} style={{ borderBottom: '1px solid var(--admin-border)' }}>
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--admin-accent)' }}>{c.code}</td>
                      <td style={tdStyle}>{c.type === 'percent' ? 'PERCENTAGE OFF' : 'FIXED AMOUNT OFF'}</td>
                      <td style={tdStyle}>{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                      <td style={tdStyle}>₹{c.minPurchase}</td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => handleToggleCoupon(c.code)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: c.isActive ? 'var(--color-success)' : '#ff1d40',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c.isActive ? 'var(--color-success)' : '#ff1d40' }} />
                          {c.isActive ? 'ACTIVE' : 'DISABLED'}
                        </button>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button 
                          onClick={() => handleDeleteCoupon(c.code)}
                          style={{ background: 'none', border: 'none', color: '#ff1d40', cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 4. MARKETING POPUP */}
        {activeTab === 'popup' && popup && (
          <form onSubmit={handleSavePopup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem', alignItems: 'center' }}>
              <h3 style={panelTitleStyle}>PROMO POPUP DISPATCH SETTINGS</h3>
              
              <button 
                type="submit" 
                style={saveBtnStyle}
                className="hover-trigger"
              >
                <Save size={14} /> SAVE POPUP SETUP
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              border: '1px solid var(--admin-border)',
              background: 'var(--admin-bg)'
            }}>
              <input
                type="checkbox"
                id="popup-active"
                checked={popup.isActive}
                onChange={(e) => handlePopupChange('isActive', e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="popup-active" style={{ fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                ENABLE NEWSLETTER SIGNUP POPUP MODAL FOR CUSTOMERS
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>POPUP HEADER TITLE</label>
                <input
                  type="text"
                  value={popup.title}
                  onChange={(e) => handlePopupChange('title', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              
              <div>
                <label style={labelStyle}>AUTO TRIGGER DELAY (SECONDS)</label>
                <input
                  type="number"
                  value={popup.delay}
                  onChange={(e) => handlePopupChange('delay', Number(e.target.value))}
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>POPUP DETAIL DESCRIPTION BODY</label>
              <textarea
                rows={3}
                value={popup.text}
                onChange={(e) => handlePopupChange('text', e.target.value)}
                style={{ ...inputStyle, resize: 'none' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>ASSOCIATED PROMO CODE ON SUBMIT</label>
                <input
                  type="text"
                  value={popup.promoCode}
                  onChange={(e) => handlePopupChange('promoCode', e.target.value.toUpperCase())}
                  style={inputStyle}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>PROMOTIONAL BG IMAGE URL (OPTIONAL)</label>
                <input
                  type="url"
                  placeholder="Leave empty for solid background..."
                  value={popup.image}
                  onChange={(e) => handlePopupChange('image', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

// Styling structures
const tabBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid transparent',
  padding: '10px 15px',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.8rem',
  fontWeight: 'bold',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s'
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--admin-text)',
  margin: 0,
  letterSpacing: '0.05em'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--admin-text-secondary)',
  marginBottom: '4px',
  letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  padding: '0.65rem 0.75rem',
  color: 'var(--admin-text)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box'
};

const saveBtnStyle: React.CSSProperties = {
  background: 'var(--admin-accent)',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  fontWeight: 'bold',
  fontSize: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer'
};

const thStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  borderBottom: '2px solid var(--admin-border)',
  color: 'var(--admin-text)'
};

const tdStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  borderBottom: '1px solid var(--admin-border)',
  verticalAlign: 'middle',
  color: 'var(--admin-text)'
};

export default AdminSettings;
