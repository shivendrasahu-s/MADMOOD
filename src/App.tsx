import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { TopHeader } from './components/TopHeader';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Checkout } from './pages/Checkout';
import { Verification } from './pages/Verification';
import { SearchPage } from './pages/SearchPage';
import { OrderTracking } from './pages/OrderTracking';
import { Policies } from './pages/Policies';
import { type Product, initDB, syncFromFirebase } from './services/db';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MailSimulator } from './components/MailSimulator';
import { Star, X, ShoppingCart } from 'lucide-react';

export const App: React.FC = () => {
  const { addItemToCart } = useApp();
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewSize, setQuickViewSize] = useState('');

  // Initial database load
  useEffect(() => {
    initDB();
    syncFromFirebase();
    // Simulate luxury loader timing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewSize(product.sizes[0]);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleQuickViewAddToCart = () => {
    if (quickViewProduct) {
      addItemToCart(quickViewProduct.id, 1, quickViewSize);
      closeQuickView();
    }
  };

  return (
    <>
      {/* LUXURY LOADING COVER */}
      {loading && (
        <div className="luxury-loader">
          <div className="loader-logo">
            MAD <span style={{ color: 'var(--color-primary)' }}>MOOD</span>
          </div>
          <div className="loader-bar">
            <div className="loader-progress" />
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--color-gray-text)' }}>
            LOADING COLLECTION...
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT LAYOUT */}
      <div className="main-viewport-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Top announcement bar and Sticky Header Navbar */}
        <TopHeader />
        <Navbar />

        {/* Dynamic Route Pages */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home onQuickView={openQuickView} />} />
            <Route path="/shop" element={<Shop onQuickView={openQuickView} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="/search" element={<SearchPage onQuickView={openQuickView} />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/order-tracking/:id" element={<OrderTracking />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Global Cart Sidebar Overlay */}
        <CartDrawer />

        {/* PREMIUM FOOTER */}
        <footer className="glass-panel" style={{
          background: 'var(--bg-black)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '5rem 0 3rem 0',
          marginTop: 'auto'
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '3rem',
              marginBottom: '4rem'
            }} className="footer-grid">
              
              {/* Brand metadata */}
              <div>
                <Link to="/" className="hover-trigger glitch-text" style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  letterSpacing: '0.25em'
                }}>
                  MAD <span style={{ color: 'var(--color-red)' }}>MOOD</span>
                </Link>
                <p style={{
                  color: 'var(--color-silver)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  marginTop: '1.25rem',
                  letterSpacing: '0.02em'
                }}>
                  Premium modern Indian fashion and streetwear. Cultivated for self-expression. We don't follow trends. We create moods.
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)' }}>
                  <p style={{ margin: 0 }}><span style={{ color: 'var(--color-white)', fontWeight: 700 }}>POWERED BY //</span> Mr. Pushpendra Sahu, Mr. Shivendra Sahu & Mr. Dipendra Sahu</p>
                  <p style={{ margin: 0, color: 'var(--color-silver-light)', fontSize: '0.75rem' }}>HQ: Unnao, Uttar Pradesh, India - 209801</p>
                  <p style={{ margin: 0, fontSize: '0.75rem' }}>
                    📞 CONTACT: <a href="tel:+916386376901" className="hover-trigger" style={{ color: 'var(--color-red)', textDecoration: 'none', fontWeight: 700 }}>+91 6386376901</a>
                  </p>
                </div>
              </div>

              {/* Collections Links */}
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', letterSpacing: '0.1em' }}>ARCHIVES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <Link to="/shop?category=Oversized%20T-Shirts" className="hover-trigger footer-link">Oversized T-Shirts</Link>
                  <Link to="/shop?category=Hoodies" className="hover-trigger footer-link">Hoodies</Link>
                  <Link to="/shop?category=Cargo%20Pants" className="hover-trigger footer-link">Cargo Pants</Link>
                  <Link to="/shop?category=Jackets" className="hover-trigger footer-link">Jackets & Outerwear</Link>
                </div>
              </div>

              {/* Help & Legal Services directory */}
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', letterSpacing: '0.1em', color: 'var(--color-white)' }}>HELP & LEGAL SERVICES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <Link to="/policies?tab=returns" className="hover-trigger footer-link">Returns & Refunds</Link>
                  <Link to="/policies?tab=shipping" className="hover-trigger footer-link">Shipping Policy</Link>
                  <Link to="/policies?tab=privacy" className="hover-trigger footer-link">Privacy Policy</Link>
                  <Link to="/policies?tab=terms" className="hover-trigger footer-link">Terms & Conditions</Link>
                  <Link to="/policies?tab=contact" className="hover-trigger footer-link">Contact Us</Link>
                  <Link to="/order-tracking" className="hover-trigger footer-link">Track Active Shipment</Link>
                  <Link to="/policies?tab=faqs" className="hover-trigger footer-link">FAQs</Link>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', letterSpacing: '0.1em' }}>NEWSLETTER SYSTEM</h4>
                <p style={{ color: 'var(--color-silver)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
                  Subscribe to receive notifications for limited apparel drop configurations.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('NODE REGISTERED: E-mail added to launch directories.'); (e.target as HTMLFormElement).reset(); }} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    placeholder="EMAIL NODE..."
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '0.5rem 0.75rem',
                      color: 'var(--color-white)',
                      fontFamily: 'var(--font-header)',
                      fontSize: '0.75rem',
                      outline: 'none',
                      flexGrow: 1,
                      borderRadius: 0
                    }}
                    required
                  />
                  <button type="submit" className="btn-premium hover-trigger" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    SUB
                  </button>
                </form>
              </div>

            </div>

            {/* Bottom Copyright & Social channels */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)' }}>
                © {new Date().getFullYear()} MAD MOOD. ALL RIGHTS RESERVED.
              </span>

              {/* Social lists */}
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover-trigger social-icon" style={{ color: 'var(--color-silver)', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover-trigger social-icon" style={{ color: 'var(--color-silver)', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover-trigger social-icon" style={{ color: 'var(--color-silver)', display: 'flex', alignItems: 'center', transition: '0.3s' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
            </div>

          </div>
        </footer>

        <style>{`
          .footer-link {
            color: var(--color-silver);
            text-decoration: none;
            transition: var(--transition-fast);
          }
          .footer-link:hover {
            color: var(--color-white);
            padding-left: 4px;
          }
          .social-icon:hover {
            color: var(--color-red) !important;
            filter: drop-shadow(0 0 5px var(--color-red));
            transform: translateY(-2px);
          }
        `}</style>
      </div>

      {/* INTERACTIVE PRODUCT QUICK VIEW MODAL OVERLAY */}
      {quickViewProduct && (
        <div
          onClick={closeQuickView}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.35s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="premium-card"
            style={{
              width: '100%',
              maxWidth: '850px',
              background: 'var(--bg-white)',
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              padding: '2.5rem',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-hover)',
              borderRadius: 'var(--radius-lg)',
              animation: 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Close cross */}
            <button
              onClick={closeQuickView}
              className="hover-trigger"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-black)',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Product image column */}
            <div style={{ position: 'relative', paddingTop: '110%', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img
                src={quickViewProduct.images[0]}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info details column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '0.15em' }}>
                {quickViewProduct.category.toUpperCase()}
              </span>
              <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem 0', letterSpacing: '0.05em', color: 'var(--color-black)' }}>{quickViewProduct.name}</h2>
              
              <div style={{ display: 'flex', color: '#ffc107', gap: '4px', marginBottom: '1rem' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < 5 ? '#ffc107' : 'none'} strokeWidth={1} />
                ))}
              </div>

              <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 800, marginBottom: '1.25rem' }}>
                ₹{quickViewProduct.price} <span style={{ textDecoration: 'line-through', color: 'var(--color-gray-text)', fontSize: '0.9rem', marginLeft: '8px', fontWeight: 'normal' }}>₹{quickViewProduct.mrp}</span>
              </p>

              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                {quickViewProduct.description}
              </p>

              {/* Sizing picks */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gray-text)', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  CHOOSE SIZE //
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {quickViewProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setQuickViewSize(size)}
                      className="hover-trigger"
                      style={{
                        background: quickViewSize === size ? 'var(--color-primary)' : 'transparent',
                        color: quickViewSize === size ? '#ffffff' : 'var(--color-black)',
                        border: '1px solid',
                        borderColor: quickViewSize === size ? 'var(--color-primary)' : 'var(--color-gray-border)',
                        fontSize: '0.7rem',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-heading)',
                        borderRadius: '4px'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty action */}
              <button
                onClick={handleQuickViewAddToCart}
                className="btn-primary-m hover-trigger"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShoppingCart size={14} /> ADD TO CART
              </button>

              <Link
                to={`/product/${quickViewProduct.id}`}
                onClick={closeQuickView}
                className="hover-trigger"
                style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)',
                  marginTop: '1rem',
                  textDecoration: 'underline',
                  fontWeight: 600
                }}
              >
                View Details & Size Guide
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Custom scale keyframe for quick view */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Global simulated notification inbox for developers */}
      <MailSimulator />
    </>
  );
};
export default App;
