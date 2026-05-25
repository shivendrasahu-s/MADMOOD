import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, currentUser, setCartOpen, userLogout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setSearchFocused(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active-link-m' : '';
  };

  return (
    <header 
      className={`sticky-header ${scrolled ? 'scrolled-header' : ''}`} 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.98)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--color-gray-border)',
        height: scrolled ? '60px' : '80px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        color: scrolled ? '#ffffff' : '#000000'
      }}
    >
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: '1rem'
      }}>
        {/* Mobile menu hamburger */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: scrolled ? '#ffffff' : 'var(--color-black)',
            display: 'none',
            padding: '8px'
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-heading)',
          fontSize: scrolled ? '1.15rem' : '1.35rem',
          fontWeight: 800,
          color: scrolled ? '#ffffff' : 'var(--color-black)',
          textDecoration: 'none',
          letterSpacing: '0.22em',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          MAD<span style={{ color: 'var(--color-gold)', marginLeft: '4px' }}>MOOD</span>
        </Link>

        {/* Navigation links (Desktop) */}
        <nav className="desktop-links" style={{
          display: 'flex',
          gap: scrolled ? '1.2rem' : '1.8rem',
          alignItems: 'center',
          height: '100%',
          transition: 'gap 0.4s ease'
        }}>
          <Link to="/" className={`nav-link-m ${isActive('/')} ${scrolled ? 'text-white' : ''}`}>Home</Link>
          
          {/* Men Mega Menu */}
          <div className="nav-mega-menu-trigger" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Link to="/shop" className={`nav-link-m ${isActive('/shop')} ${scrolled ? 'text-white' : ''}`}>
              Men
            </Link>
            
            <div className="nav-mega-menu" style={{ width: '1020px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>TOPS</h4>
                  <Link to="/shop?category=Premium%20Shirts" className="mega-menu-item">Shirts</Link>
                  <Link to="/shop?category=Polo T-Shirts" className="mega-menu-item">Polo T-Shirts</Link>
                  <Link to="/shop?category=Oversized T-Shirts" className="mega-menu-item">Oversized Tees</Link>
                  <Link to="/shop?category=Hoodies" className="mega-menu-item">Hoodies & French Terrys</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>BOTTOMS</h4>
                  <Link to="/shop?category=Jeans" className="mega-menu-item">Premium Denim Jeans</Link>
                  <Link to="/shop?category=Cargo Pants" className="mega-menu-item">Cargo Utility Pants</Link>
                </div>
              </div>

              {/* Featured Column */}
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>SEASON BESTSELLER</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=120" alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-black)' }}>CLASSIC NAVY PIQUE POLO</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>₹1,499</span>
                    <Link to="/product/ind-1" style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>QUICK SHOP</Link>
                  </div>
                </div>
              </div>

              {/* Editorial Banner */}
              <div style={{
                background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=400") center center no-repeat',
                backgroundSize: 'cover',
                padding: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                minHeight: '160px'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em' }}>MASCULINE ESSENTIALS</span>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0 8px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, lineHeight: '1.2' }}>SIGNATURE POLO COLLECTIVE</h4>
                <Link to="/shop?category=Polo T-Shirts" style={{ color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>
                  EXPLORE <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* New Arrivals Mega Menu */}
          <div className="nav-mega-menu-trigger" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Link to="/shop?sort=newest" className={`nav-link-m ${isActive('/new-arrivals')} ${scrolled ? 'text-white' : ''}`}>
              New Arrivals
            </Link>
            
            <div className="nav-mega-menu" style={{ width: '850px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>RECENT DROPS</h4>
                <Link to="/shop?category=Premium%20Shirts" className="mega-menu-item">Slim Fit Oxford Shirts</Link>
                <Link to="/shop?category=Oversized T-Shirts" className="mega-menu-item">Heavyweight Drop-Shoulder Tees</Link>
                <Link to="/shop?category=Sneakers" className="mega-menu-item">Calfskin Low-Top Sneakers</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>HOT NEW DROP</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=120" alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-black)' }}>HEAVYWEIGHT COTTON TEE</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>₹1,199</span>
                    <Link to="/product/ind-5" style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>QUICK SHOP</Link>
                  </div>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400") center center no-repeat',
                backgroundSize: 'cover',
                padding: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                minHeight: '160px'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em' }}>BOX-CUT COMFORT</span>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0 8px 0', fontWeight: 700, lineHeight: '1.2' }}>OVERSIZED STREET APPAREL</h4>
                <Link to="/shop?category=Oversized T-Shirts" style={{ color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Explore <ArrowRight size={10} /></Link>
              </div>
            </div>
          </div>

          {/* Collections Mega Menu */}
          <div className="nav-mega-menu-trigger" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Link to="/collections" className={`nav-link-m ${isActive('/collections')} ${scrolled ? 'text-white' : ''}`}>
              Collections
            </Link>
            
            <div className="nav-mega-menu" style={{ width: '850px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>EDITORIAL SELECTIONS</h4>
                <Link to="/shop?category=Premium%20Shirts" className="mega-menu-item">Summer Slub Linen Shirts</Link>
                <Link to="/shop?category=Polo T-Shirts" className="mega-menu-item">Classic Sportswear Polos</Link>
                <Link to="/shop" className="mega-menu-item">Festive Ethnic Short Kurtas</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>SEASON CAPSULE</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=120" alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-black)' }}>PURE EGYPTIAN LINEN SHIRT</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>₹2,299</span>
                    <Link to="/product/ind-3" style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>QUICK SHOP</Link>
                  </div>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400") center center no-repeat',
                backgroundSize: 'cover',
                padding: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                minHeight: '160px'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em' }}>PREMIUM SLUB LINENS</span>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0 8px 0', fontWeight: 700, lineHeight: '1.2' }}>SUMMER EDITORIAL SERIES</h4>
                <Link to="/shop?category=Premium%20Shirts" style={{ color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Explore <ArrowRight size={10} /></Link>
              </div>
            </div>
          </div>

          {/* Sneakers Mega Menu */}
          <div className="nav-mega-menu-trigger" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Link to="/shop?category=Sneakers" className={`nav-link-m ${isActive('/sneakers')} ${scrolled ? 'text-white' : ''}`}>
              Sneakers
            </Link>
            
            <div className="nav-mega-menu" style={{ width: '850px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>FOOTWEAR</h4>
                <Link to="/shop?category=Sneakers" className="mega-menu-item">Calfskin Leather Sneakers</Link>
                <Link to="/shop?category=Sneakers" className="mega-menu-item">Handcrafted Low-Tops</Link>
                <Link to="/shop?category=Sneakers" className="mega-menu-item">Premium Rubber-Sole Trainers</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>FEATURED SHOE</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=120" alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-black)' }}>CALFSKIN LOW-TOP SNEAKERS</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>₹4,999</span>
                    <Link to="/product/ind-8" style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>QUICK SHOP</Link>
                  </div>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400") center center no-repeat',
                backgroundSize: 'cover',
                padding: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                minHeight: '160px'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em' }}>ITALIAN CALFSKIN</span>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0 8px 0', fontWeight: 700, lineHeight: '1.2' }}>HANDCRAFTED SNEAKERS</h4>
                <Link to="/shop?category=Sneakers" style={{ color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Explore <ArrowRight size={10} /></Link>
              </div>
            </div>
          </div>

          {/* Accessories Mega Menu */}
          <div className="nav-mega-menu-trigger" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Link to="/shop?category=Accessories" className={`nav-link-m ${isActive('/accessories')} ${scrolled ? 'text-white' : ''}`}>
              Accessories
            </Link>
            
            <div className="nav-mega-menu" style={{ width: '850px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '4px' }}>MENS ACCESSORIES</h4>
                <Link to="/shop?category=Accessories" className="mega-menu-item">Handcrafted Leather Belts</Link>
                <Link to="/shop?category=Accessories" className="mega-menu-item">Bi-Fold Leather Wallets</Link>
                <Link to="/shop?category=Accessories" className="mega-menu-item">Premium Cotton Socks</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '8px' }}>ACCENT PIECE</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <img src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=120" alt="" style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', color: 'var(--color-black)' }}>HANDCRAFTED FULL-GRAIN BELT</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginTop: '2px' }}>₹1,299</span>
                    <Link to="/product/ind-10" style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', textDecoration: 'underline', marginTop: '6px', display: 'inline-block' }}>QUICK SHOP</Link>
                  </div>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400") center center no-repeat',
                backgroundSize: 'cover',
                padding: '1.25rem',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                height: '100%',
                minHeight: '160px'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em' }}>FULL-GRAIN LEATHER</span>
                <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0 8px 0', fontWeight: 700, lineHeight: '1.2' }}>HANDCRAFTED ACCESSORIES</h4>
                <Link to="/shop?category=Accessories" style={{ color: '#ffffff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Explore <ArrowRight size={10} /></Link>
              </div>
            </div>
          </div>

          <Link to="/about" className={`nav-link-m ${isActive('/about')} ${scrolled ? 'text-white' : ''}`}>About</Link>
          <Link to="/contact" className={`nav-link-m ${isActive('/contact')} ${scrolled ? 'text-white' : ''}`}>Contact</Link>
        </nav>

        {/* Search bar slots */}
        <form onSubmit={handleSearchSubmit} className="search-form-m" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexGrow: searchFocused ? 0.35 : 0.15,
          maxWidth: '320px',
          transition: 'flex-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <input
            type="text"
            placeholder="Search premium collections..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            style={{
              background: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-gray-light)',
              border: scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-gray-border)',
              padding: '0.55rem 1rem 0.55rem 2.2rem',
              color: scrolled ? '#ffffff' : 'var(--color-black)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              width: '100%',
              outline: 'none',
              borderRadius: '0px', // Sharp premium corners
              transition: 'all 0.2s ease'
            }}
          />
          <Search size={14} style={{
            position: 'absolute',
            left: '12px',
            color: scrolled ? 'rgba(255, 255, 255, 0.6)' : 'var(--color-gray-text)'
          }} />
        </form>

        {/* Utilities: Wishlist, Cart, Profile */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center'
        }}>
          {/* Wishlist */}
          <Link to="/dashboard?tab=wishlist" style={{
            color: scrolled ? '#ffffff' : 'var(--color-black)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }} title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-gold)', // Gold notification badge!
                color: 'var(--color-black)',
                fontSize: '0.55rem',
                padding: '2px 5px',
                borderRadius: '10px',
                fontWeight: 700
              }}>{wishlist.length}</span>
            )}
          </Link>

          {/* Cart Drawer trigger */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: scrolled ? '#ffffff' : 'var(--color-black)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            title="Shopping Bag"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--color-gold)', // Gold notification badge!
                color: 'var(--color-black)',
                fontSize: '0.55rem',
                padding: '2px 5px',
                borderRadius: '10px',
                fontWeight: 700
              }}>{cartCount}</span>
            )}
          </button>

          {/* User profile portal link */}
          {currentUser ? (
            <Link to="/dashboard" style={{
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }} title="Profile Dashboard">
              <User size={20} />
            </Link>
          ) : (
            <Link to="/auth" style={{
              color: scrolled ? '#ffffff' : 'var(--color-black)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }} title="Login / Signup">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .nav-link-m {
          text-decoration: none;
          color: var(--color-gray-text);
          font-family: var(--font-heading);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          position: relative;
          padding: 0.5rem 0;
          transition: color 0.25s ease;
        }
        .nav-link-m:hover {
          color: var(--color-gold);
        }
        .nav-link-m.active-link-m {
          color: var(--color-gold);
        }
        .nav-link-m.active-link-m::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--color-gold);
        }
        
        .mega-menu-item {
          text-decoration: none;
          color: var(--color-gray-text);
          font-size: 0.8rem;
          font-weight: 400;
          font-family: var(--font-body);
          transition: all 0.2s ease;
          display: block;
          padding: 2px 0;
        }
        
        .mega-menu-item:hover {
          color: var(--color-gold);
          padding-left: 4px;
        }

        .nav-mega-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          width: 900px;
          background-color: #ffffff;
          border: 1px solid var(--color-gray-border);
          border-top: 3px solid var(--color-gold); /* Add gold accent bar at the top! */
          box-shadow: var(--shadow-hover);
          border-radius: 0px; /* Sharp premium corners */
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr; /* 3 columns layout */
          gap: 1.5rem;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 1000;
          text-align: left;
        }
        
        .nav-mega-menu-trigger:hover .nav-mega-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .text-white {
          color: #ffffff !important;
        }
        .text-white:hover {
          color: var(--color-gold) !important;
        }

        @media (max-width: 990px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
          .search-form-m {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Drawer view menu */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-nav" style={{
          position: 'fixed',
          top: scrolled ? '60px' : '80px',
          left: 0,
          width: '100%',
          height: `calc(100vh - ${scrolled ? '60px' : '80px'})`,
          background: '#ffffff',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          animation: 'slideDownNav 0.3s ease-out'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>HOME</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>SHOP ALL</Link>
          <Link to="/shop?category=Polo T-Shirts" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-gray-text)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600 }}>PREMIUM POLOS</Link>
          <Link to="/shop?category=Shirts" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-gray-text)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600 }}>CASUAL SHIRTS</Link>
          <Link to="/shop?category=Jeans" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-gray-text)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 600 }}>EXECUTIVE JEANS</Link>
          <Link to="/collections" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>COLLECTIONS</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>ABOUT US</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em' }}>CONTACT</Link>
          {currentUser && (
            <button
              onClick={() => {
                userLogout();
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              DISCONNECT <LogOut size={16} />
            </button>
          )}
        </div>
      )}
      <style>{`
        @keyframes slideDownNav {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};
export default Navbar;
