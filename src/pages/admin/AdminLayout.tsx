import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  SlidersHorizontal, 
  LogOut, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Theme state
  const [isDark, setIsDark] = useState(() => localStorage.getItem('mmi_admin_dark') === 'true');
  
  // Responsive sidebar toggles
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; text: string; date: string; read: boolean }[]>([
    { id: '1', text: 'Low Stock Alert: Signature Polo Shirt (size M) is below 5 units.', date: '10 mins ago', read: false },
    { id: '2', text: 'Return Request Filed: Order MM-IND-100234 size exchange.', date: '1 hr ago', read: false },
    { id: '3', text: 'New Premium Order Registered: MM-IND-100259 (₹3,499)', date: '3 hrs ago', read: true }
  ]);

  // Route security checks
  useEffect(() => {
    const adminSession = sessionStorage.getItem('mmi_admin_authenticated');
    const adminEmail = sessionStorage.getItem('mmi_admin_email');
    
    if (adminSession !== 'true' || adminEmail !== 'shivendrasahu003@gmail.com') {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('mmi_admin_dark', isDark ? 'true' : 'false');
  }, [isDark]);

  // Close menus on page transitions
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem('mmi_admin_authenticated');
    sessionStorage.removeItem('mmi_admin_email');
    navigate('/admin/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminTheme = isDark ? {
    '--admin-bg': '#121212',
    '--admin-card-bg': '#1e1e1e',
    '--admin-text': '#f8f9fa',
    '--admin-text-secondary': '#adb5bd',
    '--admin-border': 'rgba(255, 255, 255, 0.08)',
    '--admin-sidebar-bg': '#000000',
    '--admin-sidebar-hover': '#1e1e1e',
    '--admin-hover-effect': 'rgba(255, 255, 255, 0.03)',
    '--admin-primary': '#ffffff',
    '--admin-accent': '#c5a880' // Gold accent
  } as React.CSSProperties : {
    '--admin-bg': '#f5f7fb',
    '--admin-card-bg': '#ffffff',
    '--admin-text': '#000000',
    '--admin-text-secondary': '#495057',
    '--admin-border': '#dee2e6',
    '--admin-sidebar-bg': '#0a1d37', // Premium Navy
    '--admin-sidebar-hover': 'rgba(255, 255, 255, 0.08)',
    '--admin-hover-effect': 'rgba(0, 0, 0, 0.02)',
    '--admin-primary': '#0a1d37',
    '--admin-accent': '#c5a880'
  } as React.CSSProperties;

  const sidebarLinks = [
    { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { path: '/admin/orders', label: 'Orders', icon: Package },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: SlidersHorizontal }
  ];

  return (
    <div style={{ ...adminTheme, backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      
      {/* TOP HEADER */}
      <header style={{
        height: '65px',
        borderBottom: '1px solid var(--admin-border)',
        backgroundColor: 'var(--admin-card-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Left branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            style={{ background: 'none', border: 'none', color: 'var(--admin-text)', cursor: 'pointer', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--admin-accent)" />
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: 'var(--admin-text)'
            }}>
              MADMOOD <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--admin-accent)', verticalAlign: 'middle', border: '1px solid var(--admin-accent)', padding: '1px 4px', marginLeft: '4px' }}>ADMIN</span>
            </span>
          </Link>
        </div>

        {/* Right utility items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Light/Dark mode */}
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--admin-text)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--admin-hover-effect)',
              transition: 'background-color 0.2s'
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--admin-text)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--admin-hover-effect)'
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: '#ff1d40',
                  color: '#ffffff',
                  fontSize: '0.55rem',
                  fontWeight: 'bold',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification drop panel */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--admin-card-bg)',
                border: '1px solid var(--admin-border)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                padding: '1rem',
                animation: 'slideIn 0.25s ease',
                zIndex: 200
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 800 }}>NOTIFICATIONS SYSTEM</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      style={{ background: 'none', border: 'none', color: 'var(--admin-accent)', fontSize: '0.65rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      MARK ALL READ
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.02)', paddingBottom: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: n.read ? 'transparent' : 'var(--admin-accent)', marginTop: '5px', flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, color: 'var(--admin-text)', lineHeight: '1.3' }}>{n.text}</p>
                        <span style={{ fontSize: '0.6rem', color: 'var(--admin-text-secondary)' }}>{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile name and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--admin-border)', paddingLeft: '1rem' }}>
            <div style={{ textAlign: 'right', display: 'block' }} className="admin-profile-name">
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700 }}>SHIVENDRA S.</p>
              <span style={{ fontSize: '0.6rem', color: 'var(--admin-accent)' }}>SUPER ADMIN</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff1d40',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 29, 64, 0.05)'
              }}
              title="Logout Session"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* CORE MIDDLE SECTION */}
      <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        
        {/* DESKTOP SIDEBAR */}
        <aside className="admin-sidebar" style={{
          width: '260px',
          backgroundColor: 'var(--admin-sidebar-bg)',
          borderRight: '1px solid var(--admin-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1rem',
          flexShrink: 0
        }}>
          <span style={{
            display: 'block',
            fontSize: '0.6rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '1rem',
            letterSpacing: '0.1em',
            paddingLeft: '0.75rem'
          }}>
            NAVIGATION CONSOLE //
          </span>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1rem',
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                    backgroundColor: isActive ? 'var(--admin-accent)' : 'transparent',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.02em',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  className="sidebar-link-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={16} style={{ flexShrink: 0, color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)' }} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <ChevronRight size={12} />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MOBILE SLIDE-OUT MENU OVERLAY */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', top: '65px', left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '260px',
                height: '100%',
                backgroundColor: 'var(--admin-sidebar-bg)',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideRight 0.3s ease'
              }}
            >
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.8rem 1rem',
                        textDecoration: 'none',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                        backgroundColor: isActive ? 'var(--admin-accent)' : 'transparent',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 700 : 500,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={16} style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)' }} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* SUBPAGE VIEWPORT CONTAINER */}
        <main style={{ flexGrow: 1, padding: '2rem', overflowX: 'hidden' }}>
          <Outlet />
        </main>

      </div>

      <style>{`
        .sidebar-link-btn:hover {
          background-color: var(--admin-sidebar-hover);
          color: #ffffff !important;
          padding-left: 1.25rem;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
          .admin-profile-name {
            display: none !important;
          }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
export default AdminLayout;
