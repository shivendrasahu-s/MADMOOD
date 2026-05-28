import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User, Heart, Search, Menu, X, LogOut, ArrowRight, Clock, TrendingUp, ArrowUpRight, Grid } from 'lucide-react';
import { getSearchSuggestions, addRecentSearch, type SearchSuggestions } from '../services/searchService';
import { getStoredData, setStoredData } from '../services/db';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, currentUser, setCartOpen, userLogout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    recent: [],
    trending: [],
    suggestedCategories: [],
    predictedKeywords: [],
    matchedProducts: []
  });
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const flatItems: { label: string; type: 'category' | 'keyword' | 'product' | 'recent' | 'trending'; value: string; url: string; data?: any }[] = [];

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

  // Sync suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      const res = getSearchSuggestions(searchVal);
      setSuggestions(res);
      setHighlightIndex(-1);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchVal, searchFocused, mobileSearchOpen]);

  // Click outside to close desktop search suggestion dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      addRecentSearch(searchVal.trim());
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setSearchFocused(false);
      setMobileSearchOpen(false);
    }
  };

  const handleSelectSuggestion = (value: string, url: string, type: string) => {
    if (type !== 'product') {
      addRecentSearch(value);
    }
    navigate(url);
    setSearchFocused(false);
    setMobileSearchOpen(false);
    setSearchVal('');
  };

  const handleDeleteRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const recent = getStoredData<string[]>('mmi_recent_searches', []);
    const updated = recent.filter(r => r.toLowerCase() !== term.toLowerCase());
    setStoredData('mmi_recent_searches', updated);
    setSuggestions(prev => ({
      ...prev,
      recent: updated
    }));
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
        {/* Keyboard navigation list compiler */}
        {(() => {
          flatItems.length = 0; // Clear array
          if (searchFocused) {
            if (!searchVal.trim()) {
              suggestions.recent.forEach(r => flatItems.push({ label: r, type: 'recent', value: r, url: `/search?q=${encodeURIComponent(r)}` }));
              suggestions.trending.forEach(t => flatItems.push({ label: t, type: 'trending', value: t, url: `/search?q=${encodeURIComponent(t)}` }));
            } else {
              suggestions.suggestedCategories.forEach(c => flatItems.push({ label: c, type: 'category', value: c, url: `/search?q=${encodeURIComponent(c)}` }));
              suggestions.predictedKeywords.forEach(k => flatItems.push({ label: k, type: 'keyword', value: k, url: `/search?q=${encodeURIComponent(k)}` }));
              suggestions.matchedProducts.forEach(p => flatItems.push({ label: p.name, type: 'product', value: p.name, url: `/product/${p.id}`, data: p }));
            }
          }
          return null;
        })()}

        <div ref={searchContainerRef} className="search-form-container-m" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: searchFocused ? 0.35 : 0.15,
          maxWidth: '320px',
          transition: 'flex-grow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search premium collections..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setHighlightIndex(prev => (prev < flatItems.length - 1 ? prev + 1 : prev));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setHighlightIndex(prev => (prev > -1 ? prev - 1 : -1));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (highlightIndex >= 0 && highlightIndex < flatItems.length) {
                    const item = flatItems[highlightIndex];
                    handleSelectSuggestion(item.value, item.url, item.type);
                  } else if (searchVal.trim()) {
                    handleSearchSubmit(e);
                  }
                } else if (e.key === 'Escape') {
                  setSearchFocused(false);
                  setHighlightIndex(-1);
                }
              }}
              style={{
                background: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-gray-light)',
                border: scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid var(--color-gray-border)',
                padding: '0.55rem 1rem 0.55rem 2.2rem',
                color: scrolled ? '#ffffff' : 'var(--color-black)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                width: '100%',
                outline: 'none',
                borderRadius: '0px',
                transition: 'all 0.2s ease'
              }}
            />
            <Search size={14} style={{
              position: 'absolute',
              left: '12px',
              color: scrolled ? 'rgba(255, 255, 255, 0.6)' : 'var(--color-gray-text)'
            }} />
          </form>

          {/* DESKTOP SEARCH SUGGESTIONS PANEL */}
          {searchFocused && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '520px',
              background: scrolled ? '#111111' : '#ffffff',
              border: scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #111111',
              boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
              zIndex: 9999,
              marginTop: '5px',
              color: scrolled ? '#ffffff' : '#111111',
              display: 'grid',
              gridTemplateColumns: (!searchVal.trim() && suggestions.recent.length === 0) ? '1fr' : '1.2fr 1.8fr',
              gap: '0px',
              fontFamily: "'Inter', sans-serif"
            }}>
              
              {/* Left Side: Keywords/Categories */}
              <div style={{
                padding: '1.25rem',
                borderRight: (!searchVal.trim() && suggestions.recent.length === 0) ? 'none' : (scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eee'),
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {!searchVal.trim() ? (
                  <>
                    {suggestions.recent.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                          RECENT SEARCHES
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {suggestions.recent.map((term, index) => {
                            const isHighlighted = flatItems.indexOf(flatItems.find(f => f.type === 'recent' && f.value === term)!) === highlightIndex;
                            return (
                              <div
                                key={index}
                                onClick={() => handleSelectSuggestion(term, `/search?q=${encodeURIComponent(term)}`, 'recent')}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: '0.75rem',
                                  color: scrolled ? '#ccc' : '#444',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                  backgroundColor: isHighlighted ? (scrolled ? 'rgba(255,255,255,0.08)' : '#f5f5f5') : 'transparent'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Clock size={12} color="#888" />
                                  <span>{term}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteRecent(e, term)}
                                  style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '2px' }}
                                  title="Remove"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                        TRENDING SEARCHES
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {suggestions.trending.map((term, index) => {
                          const isHighlighted = flatItems.indexOf(flatItems.find(f => f.type === 'trending' && f.value === term)!) === highlightIndex;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectSuggestion(term, `/search?q=${encodeURIComponent(term)}`, 'trending')}
                              style={{
                                backgroundColor: isHighlighted ? 'var(--color-gold)' : (scrolled ? 'rgba(255,255,255,0.08)' : '#f5f5f5'),
                                color: isHighlighted ? '#111' : (scrolled ? '#fff' : '#111'),
                                border: 'none',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <TrendingUp size={10} color={isHighlighted ? '#111' : '#D4AF37'} />
                              {term}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Matched Categories */}
                    {suggestions.suggestedCategories.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          CATEGORIES
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {suggestions.suggestedCategories.map((cat, index) => {
                            const isHighlighted = flatItems.indexOf(flatItems.find(f => f.type === 'category' && f.value === cat)!) === highlightIndex;
                            return (
                              <div
                                key={index}
                                onClick={() => handleSelectSuggestion(cat, `/search?q=${encodeURIComponent(cat)}`, 'category')}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  color: scrolled ? '#fff' : '#111',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: isHighlighted ? (scrolled ? 'rgba(255,255,255,0.08)' : '#f5f5f5') : 'transparent'
                                }}
                              >
                                <Grid size={12} color="#D4AF37" />
                                {cat}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Predicted Keywords */}
                    {suggestions.predictedKeywords.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          SUGGESTED KEYWORDS
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {suggestions.predictedKeywords.map((kw, index) => {
                            const isHighlighted = flatItems.indexOf(flatItems.find(f => f.type === 'keyword' && f.value === kw)!) === highlightIndex;
                            return (
                              <div
                                key={index}
                                onClick={() => handleSelectSuggestion(kw, `/search?q=${encodeURIComponent(kw)}`, 'keyword')}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  color: scrolled ? '#ccc' : '#444',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor: isHighlighted ? (scrolled ? 'rgba(255,255,255,0.08)' : '#f5f5f5') : 'transparent'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Search size={10} color="#888" />
                                  <span>{kw}</span>
                                </div>
                                <ArrowUpRight size={12} color="#bbb" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Right Side: Matching Products */}
              {searchVal.trim() && (
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    MATCHING PRODUCTS
                  </h4>

                  {suggestions.matchedProducts.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: '#888', padding: '1rem 0' }}>
                      No matching products found.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {suggestions.matchedProducts.map((p) => {
                        const isHighlighted = flatItems.indexOf(flatItems.find(f => f.type === 'product' && f.value === p.name)!) === highlightIndex;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              navigate(`/product/${p.id}`);
                              setSearchFocused(false);
                              setSearchVal('');
                            }}
                            style={{
                              display: 'flex',
                              gap: '8px',
                              cursor: 'pointer',
                              padding: '4px',
                              backgroundColor: isHighlighted ? (scrolled ? 'rgba(255,255,255,0.08)' : '#f5f5f5') : 'transparent',
                              transition: 'background 0.2s ease'
                            }}
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{ width: '36px', height: '45px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.05)' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flexGrow: 1 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                                {p.name}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: '#888' }}>
                                {p.category} • ₹{p.price}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Utilities: Wishlist, Cart, Profile */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'center'
        }}>
          {/* Mobile Search Button Trigger */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="mobile-search-trigger-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: scrolled ? '#ffffff' : 'var(--color-black)',
              padding: '4px',
              cursor: 'pointer'
            }}
            title="Search"
          >
            <Search size={20} />
          </button>

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

        .mobile-search-trigger-btn {
          display: none !important;
        }
        @media (max-width: 990px) {
          .desktop-links {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
          .search-form-container-m {
            display: none !important;
          }
          .mobile-search-trigger-btn {
            display: flex !important;
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

      {/* FULLSCREEN MOBILE SEARCH OVERLAY */}
      {mobileSearchOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#ffffff',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          fontFamily: "'Inter', sans-serif"
        }}>
          {/* Mobile Search Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <form onSubmit={handleSearchSubmit} style={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                autoFocus
                placeholder="Search streetwear, polo shirts, sizes..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  border: '1px solid #111111',
                  borderRadius: '0px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  color: '#111'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', color: '#666' }} />
            </form>
            <button
              type="button"
              onClick={() => { setMobileSearchOpen(false); setSearchVal(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#111111',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                padding: '0.55rem 0'
              }}
            >
              CLOSE
            </button>
          </div>

          {/* Suggestions Content for Mobile */}
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {!searchVal.trim() ? (
              <div>
                {suggestions.recent.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '1rem' }}>
                      RECENT SEARCHES
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {suggestions.recent.map((term, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectSuggestion(term, `/search?q=${encodeURIComponent(term)}`, 'recent')}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#333', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={14} color="#888" />
                            <span>{term}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteRecent(e, term)}
                            style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    TRENDING SEARCHES
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {suggestions.trending.map((term, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSuggestion(term, `/search?q=${encodeURIComponent(term)}`, 'trending')}
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          fontSize: '0.8rem',
                          color: '#111',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <TrendingUp size={12} color="#D4AF37" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {suggestions.suggestedCategories.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      CATEGORIES
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {suggestions.suggestedCategories.map((cat, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectSuggestion(cat, `/search?q=${encodeURIComponent(cat)}`, 'category')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#111', fontWeight: 700, cursor: 'pointer' }}
                        >
                          <Grid size={14} color="#D4AF37" />
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.predictedKeywords.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      SUGGESTIONS
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {suggestions.predictedKeywords.map((kw, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelectSuggestion(kw, `/search?q=${encodeURIComponent(kw)}`, 'keyword')}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#333', cursor: 'pointer', paddingBottom: '0.5rem', borderBottom: '1px solid #f5f5f5' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={12} color="#888" />
                            <span>{kw}</span>
                          </div>
                          <ArrowUpRight size={14} color="#bbb" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.matchedProducts.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      PRODUCTS
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {suggestions.matchedProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setMobileSearchOpen(false);
                            setSearchVal('');
                          }}
                          style={{ display: 'flex', gap: '0.75rem', cursor: 'pointer' }}
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{ width: '40px', height: '50px', objectFit: 'cover', border: '1px solid #eee' }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#111' }}>{product.name}</span>
                            <span style={{ fontSize: '0.65rem', color: '#666' }}>₹{product.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
