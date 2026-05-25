import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, getBannersSettings, getPopupSettings } from '../services/db';
import type { Product } from '../services/db';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { ArrowRight, Percent, CheckCircle, ChevronLeft, ChevronRight, X, Mail, Sparkles, Send } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HomeProps {
  onQuickView: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onQuickView }) => {
  const { addItemToCart } = useApp();
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Hero Carousel State
  const [heroSlides, setHeroSlides] = useState<any[]>(getBannersSettings());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Promo Popup State
  const [popupSettings, setPopupSettings] = useState<any>(getPopupSettings());
  const [showPopup, setShowPopup] = useState(false);
  const [popupEmail, setPopupEmail] = useState('');
  const [popupSubmitted, setPopupSubmitted] = useState(false);

  // AI Stylist states
  const [styleVibe, setStyleVibe] = useState('CLASSIC');
  const [colorTone, setColorTone] = useState('DARK');
  const [aiOutfit, setAiOutfit] = useState<Product[] | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const promoBanners = [
    { text: 'NEW SEASON ARRIVALS // DISCOVER SLIM FIT SHIRTS & PREMIUM POLOS', color: 'var(--color-primary)' },
    { text: 'FREE COURIER SHIPPING ACROSS INDIA FOR ALL ORDERS ABOVE ₹999', color: 'var(--color-black)' },
    { text: 'SIGN UP TO OUR NEWSLETTER TO GET 15% OFF REGULAR PRICING', color: '#8c1d40' }
  ];

  useEffect(() => {
    // Fetch products
    const all = getProducts();
    setAllProducts(all);

    // Reload banners and popup configurations
    const activeSlides = getBannersSettings();
    setHeroSlides(activeSlides);
    const activePopup = getPopupSettings();
    setPopupSettings(activePopup);

    // Promo banner sliding interval
    const bannerInterval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % promoBanners.length);
    }, 5000);

    // Promo Popup trigger once per session
    if (activePopup && activePopup.isActive) {
      const isDismissed = sessionStorage.getItem('mmi_promo_dismissed');
      if (!isDismissed) {
        const popupTimeout = setTimeout(() => {
          setShowPopup(true);
        }, activePopup.delay * 1000);
        return () => {
          clearInterval(bannerInterval);
          clearTimeout(popupTimeout);
        };
      }
    }

    return () => {
      clearInterval(bannerInterval);
    };
  }, []);

  // Filter products for the 8 Curations
  const newArrivals = allProducts.filter(p => p.isNewRelease);
  const trending = allProducts.filter(p => {
    const avg = p.reviews.length ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length : 5;
    return avg >= 4.0;
  });
  const summerEssentials = allProducts.filter(p => p.category === 'Premium Shirts');
  const premiumPolos = allProducts.filter(p => p.category === 'Polo T-Shirts');
  const bestSellersList = allProducts.filter(p => p.isBestSeller);
  const sneakersList = allProducts.filter(p => p.category === 'Sneakers');
  const oversizedStreetwear = allProducts.filter(p => p.category === 'Oversized T-Shirts');
  const seasonal = allProducts.filter(p => p.category === 'Hoodies');

  const handleDismissPopup = () => {
    sessionStorage.setItem('mmi_promo_dismissed', 'true');
    setShowPopup(false);
  };

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (popupEmail.trim()) {
      setPopupSubmitted(true);
      sessionStorage.setItem('mmi_promo_dismissed', 'true');
    }
  };

  const handleAIRecommender = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAI(true);
    setAiOutfit(null);

    setTimeout(() => {
      const all = getProducts();
      let matched: Product[] = [];

      if (styleVibe === 'CLASSIC') {
        matched = all.filter(p => p.category === 'Polo T-Shirts' || p.category === 'Premium Shirts');
      } else if (styleVibe === 'STREET') {
        matched = all.filter(p => p.category === 'Oversized T-Shirts' || p.category === 'Hoodies');
      } else if (styleVibe === 'UTILITY') {
        matched = all.filter(p => p.category === 'Jeans' || p.category === 'Cargo Pants');
      } else {
        matched = all.filter(p => p.category === 'Sneakers' || p.category === 'Accessories');
      }

      // Filter by color check mock
      if (colorTone === 'LIGHT') {
        matched = matched.filter(p => 
          p.name.toLowerCase().includes('white') || 
          p.name.toLowerCase().includes('linen') || 
          p.name.toLowerCase().includes('striped')
        );
      } else {
        matched = matched.filter(p => 
          p.name.toLowerCase().includes('navy') || 
          p.name.toLowerCase().includes('indigo') || 
          p.name.toLowerCase().includes('black') ||
          p.name.toLowerCase().includes('dark') ||
          p.name.toLowerCase().includes('french') ||
          p.name.toLowerCase().includes('heavyweight')
        );
      }

      // Fallback if filtering is too specific
      if (matched.length === 0) {
        matched = all.slice(0, 2);
      }

      setAiOutfit(matched.slice(0, 3));
      setLoadingAI(false);
    }, 1200);
  };

  const renderCollectionCarousel = (title: string, subtitle: string, products: Product[], exploreLink: string) => {
    if (products.length === 0) return null;
    return (
      <section className="premium-carousel-section" style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            paddingBottom: '12px'
          }}>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {subtitle}
              </span>
              <h3 style={{ fontSize: '1.45rem', marginTop: '4px', fontFamily: 'var(--font-heading)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
            </div>
            <Link to={exploreLink} style={{
              color: 'var(--color-black)',
              textDecoration: 'none',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              letterSpacing: '0.05em'
            }}>
              EXPLORE ALL <ArrowRight size={12} />
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1.2}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            style={{ padding: '1rem 0' }}
            className="product-carousel-swiper"
          >
            {products.map(p => (
              <SwiperSlide key={p.id}>
                <ProductCard product={p} onQuickView={onQuickView} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  };

  const categories = [
    { name: 'Polo T-Shirts', label: 'Premium Polos', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=300' },
    { name: 'Shirts', label: 'Linen Shirts', image: 'https://images.unsplash.com/photo-1620012253295-c05cb127c213?auto=format&fit=crop&q=80&w=300' },
    { name: 'Oversized T-Shirts', label: 'Oversized Tees', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300' },
    { name: 'Cargo Pants', label: 'Street Cargos', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=300' },
    { name: 'Sneakers', label: 'Sneakers', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=300' }
  ];

  return (
    <div style={{ background: 'var(--bg-white)', position: 'relative' }}>
      
      {/* Sliding promo sales bar */}
      <div style={{
        backgroundColor: promoBanners[activeBannerIdx].color,
        color: '#ffffff',
        textAlign: 'center',
        padding: '0.55rem 1rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        fontFamily: 'var(--font-heading)',
        letterSpacing: '0.08em',
        transition: 'all 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        zIndex: 10
      }}>
        <Percent size={12} /> {promoBanners[activeBannerIdx].text}
      </div>

      {/* HERO HERO AUTO-SCROLL CAROUSEL */}
      <section 
        style={{
          height: 'calc(80vh - 80px)',
          minHeight: '520px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#050e1b',
          color: '#ffffff'
        }}
      >
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
            bulletClass: 'custom-bullet',
            bulletActiveClass: 'custom-bullet-active'
          }}
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          style={{ height: '100%', width: '100%' }}
          className="hero-swiper"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx} style={{ overflow: 'hidden', position: 'relative', height: '100%' }}>
              
              {/* Slide Background Image with cinematic slow zoom */}
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="hero-slide-image"
                />
                
                {/* Dark Overlay for Readability */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 100%)',
                  zIndex: 1
                }} />
              </div>

              {/* Text / Button content card overlay */}
              <div className="container" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                zIndex: 2,
                pointerEvents: 'none'
              }}>
                <AnimatePresence>
                  {currentSlide === idx && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ 
                        maxWidth: '650px', 
                        padding: '1.5rem', 
                        color: '#ffffff', 
                        pointerEvents: 'auto',
                        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                      }}
                      className="hero-content-box"
                    >
                      <span style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: '0.85rem', 
                        color: 'var(--color-gold)', 
                        fontWeight: 700, 
                        letterSpacing: '0.25em', 
                        display: 'block', 
                        marginBottom: '12px', 
                        textTransform: 'uppercase' 
                      }}>
                        {slide.subtitle}
                      </span>
                      <h2 style={{ 
                        fontSize: 'calc(2.2rem + 1.8vw)', 
                        fontWeight: 800, 
                        margin: '0 0 16px 0', 
                        fontFamily: 'var(--font-heading)', 
                        lineHeight: '1.15', 
                        color: '#ffffff', 
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase'
                      }}>
                        {slide.title}
                      </h2>
                      <p style={{ 
                        fontSize: '0.95rem', 
                        color: 'rgba(255, 255, 255, 0.85)', 
                        marginBottom: '2.5rem', 
                        lineHeight: '1.6' 
                      }}>
                        {slide.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => navigate(slide.link)} 
                          className="btn-accent-m hover-trigger" 
                          style={{ borderRadius: '0px', padding: '0.9rem 2.5rem', fontSize: '0.8rem' }}
                        >
                          SHOP NOW
                        </button>
                        <button 
                          onClick={() => navigate('/shop')} 
                          className="btn-outline-m hover-trigger" 
                          style={{ borderRadius: '0px', padding: '0.9rem 2.5rem', fontSize: '0.8rem' }}
                        >
                          EXPLORE COLLECTION
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Arrow Controls (Swiper custom bind) */}
        <button
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          className="swiper-button-prev-custom carousel-btn-hover"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          className="swiper-button-next-custom carousel-btn-hover"
        >
          <ChevronRight size={20} />
        </button>

        {/* Navigation Dots (Swiper custom bind) */}
        <div 
          className="swiper-pagination-custom"
          style={{
            position: 'absolute',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10
          }}
        />
      </section>

      {/* QUICK CIRCULAR CATEGORIES SECTION */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-gray-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.15rem', textAlign: 'center', marginBottom: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            SHOP MENSWEAR ESSENTIALS
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }} className="category-scroll-container">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'var(--color-black)'
                }}
              >
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #ffffff',
                  boxShadow: 'var(--shadow-subtle)',
                  marginBottom: '12px',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} className="cat-circle">
                  <img 
                    src={cat.image} 
                    alt={cat.label} 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC CURATED COLLECTION CAROUSELS */}
      {renderCollectionCarousel("NEW ARRIVALS", "01 // THE FRESH DROPS", newArrivals, "/shop?sort=newest")}
      {renderCollectionCarousel("TRENDING NOW", "02 // CULT CLASSICS", trending, "/shop?sort=rating")}
      {renderCollectionCarousel("SUMMER ESSENTIALS", "03 // LIGHT & BREATHABLE", summerEssentials, "/shop?category=Shirts")}
      {renderCollectionCarousel("PREMIUM POLO COLLECTION", "04 // THE SPORTY CLASSIC", premiumPolos, "/shop?category=Polo%20T-Shirts")}
      {renderCollectionCarousel("BEST SELLERS", "05 // POPULAR SELECTIONS", bestSellersList, "/shop?sort=popular")}
      {renderCollectionCarousel("SNEAKERS COLLECTION", "06 // PREMIUM CALFSKIN", sneakersList, "/shop?category=Sneakers")}
      {renderCollectionCarousel("OVERSIZED STREETWEAR", "07 // LOOSE RELAXED FITS", oversizedStreetwear, "/shop?category=Oversized%20T-Shirts")}
      {renderCollectionCarousel("SEASONAL COLLECTION", "08 // WARM COMFORT CAPSULES", seasonal, "/shop?category=Hoodies")}

      {/* EDITORIAL SHOWCASE SECTION */}
      <section style={{ padding: '2rem 0 5rem 0', borderTop: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }} className="editorial-grid">
            
            {/* Left large fashion block image */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
              <img 
                src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800" 
                alt="Craftsmanship" 
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                }}
                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'linear-gradient(transparent, rgba(10, 29, 55, 0.95))',
                padding: '2.5rem 2rem',
                color: '#ffffff'
              }}>
                <span style={{ fontSize: '0.65rem', color: '#ffd700', fontWeight: 700, letterSpacing: '0.15em' }}>01 // AUTHENTIC STRUCTURE</span>
                <h3 style={{ color: '#ffffff', fontSize: '1.25rem', margin: '6px 0 0 0', fontFamily: 'var(--font-heading)' }}>MERCERIZED EGYPTIAN WEAVES</h3>
              </div>
            </div>

            {/* Right details */}
            <div style={{ padding: '1rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-text)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                EDITORIAL SHOWCASE
              </span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '8px 0 1.5rem 0', lineHeight: '1.25' }}>
                WE DON’T FOLLOW TRENDS. WE CREATE MOODS.
              </h2>
              <blockquote style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontSize: '1rem',
                color: 'var(--color-primary)',
                fontStyle: 'italic',
                margin: '0 0 2rem 0',
                lineHeight: '1.6',
                fontWeight: 500
              }}>
                "Streetwear is often defined by fast trends. MAD MOOD is defined by structural permanence. We design masculine silhouettes using pre-washed, heavy cottons and genuine materials built to last."
              </blockquote>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-text)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                Every clothing release is produced in limited capsule batches to prevent wastage. From our calfskin low-tops handcrafted in custom molds to slub shirts woven out of organic Egyptian linen yarns, MAD MOOD blends clean Zara layouts with classic sports tailoring.
              </p>
              <button onClick={() => navigate('/about')} className="btn-accent-m" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                READ OUR HERITAGE <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* MINIMAL AI RECOMMENDER */}
      <section style={{
        padding: '5.5rem 0',
        background: 'var(--bg-gray-light)',
        borderTop: '1px solid var(--color-gray-border)',
        borderBottom: '1px solid var(--color-gray-border)'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              INTELLIGENT OUTFIT ENGINE
            </span>
            <h2 style={{ fontSize: '1.65rem', fontFamily: 'var(--font-heading)', marginTop: '4px', fontWeight: 800 }}>MAD AI COORDINATE STYLIST</h2>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', marginTop: '6px' }}>
              Select your style vibe and preferred shade to generate an instant matching coordinate set from our collection.
            </p>
          </div>

          <form onSubmit={handleAIRecommender} style={{
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-subtle)',
            border: '1px solid var(--color-gray-border)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  SELECT STYLE PROFILE
                </label>
                <select
                  value={styleVibe}
                  onChange={(e) => setStyleVibe(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: '4px',
                    padding: '0.7rem',
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  <option value="CLASSIC">CLASSIC (POLOS & SHIRTS)</option>
                  <option value="STREET">STREET (OVERSIZED & HOODIES)</option>
                  <option value="UTILITY">UTILITY (JEANS & CARGOS)</option>
                  <option value="FOOTWEAR">ESSENTIALS (SNEAKERS & ACCESSORIES)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
                  SELECT PREFERRED SHADE
                </label>
                <select
                  value={colorTone}
                  onChange={(e) => setColorTone(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: '4px',
                    padding: '0.7rem',
                    fontSize: '0.8rem',
                    outline: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  <option value="DARK">NAVY, BLACK & RICH INDIGO SHADES</option>
                  <option value="LIGHT">CREAM, WHITE & STRIPED LIGHT SHADES</option>
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                className="btn-accent-m"
                style={{ width: '100%', maxWidth: '320px', padding: '0.8rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={loadingAI}
              >
                <Sparkles size={14} /> {loadingAI ? 'ANALYZING SPECS...' : 'GENERATE COORDINATES'}
              </button>
            </div>
          </form>

          {/* Results */}
          {aiOutfit && (
            <div style={{ marginTop: '3.5rem', animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', textAlign: 'center', letterSpacing: '0.15em', fontWeight: 700 }}>
                // CORRELATED COORDINATES GENERATED
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '2rem'
              }}>
                {aiOutfit.map(p => (
                  <div key={p.id} style={{
                    padding: '1.25rem',
                    background: '#ffffff',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-subtle)'
                  }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 600, margin: '0 0 6px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.name}</h4>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>₹{p.price.toLocaleString('en-IN')}</p>
                    <button
                      onClick={() => {
                        addItemToCart(p.id, 1, p.sizes[0]);
                        alert(`ADDED TO CART: ${p.name} (Size: ${p.sizes[0]}) added successfully.`);
                      }}
                      className="btn-primary-m"
                      style={{ padding: '6px 12px', fontSize: '0.7rem', width: '100%', borderRadius: '4px' }}
                    >
                      ADD OUTFIT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INDIAN eCommerce TRUST ASSURANCES */}
      <section style={{ padding: '4.5rem 0', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CheckCircle size={28} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>FREE CORRESPONDENT EXPRESS SHIPPING</h4>
              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', lineHeight: '1.4' }}>Complimentary dispatch for all orders above ₹999 across India</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CheckCircle size={28} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>CASH ON DELIVERY (COD)</h4>
              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', lineHeight: '1.4' }}>Pay at your doorstep securely. Verification call on placement</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CheckCircle size={28} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.02em' }}>EASY 15-DAY RETURN WINDOW</h4>
              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', lineHeight: '1.4' }}>Hassle-free reverse pick-ups arranged instantly through dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM LOOKBOOK FEED */}
      {/* INSTAGRAM LOOKBOOK FEED */}
      <section style={{ padding: '6rem 0', borderTop: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              EDITORIAL SHOWCASE
            </span>
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>@MADMOOD.IN // THE REELS</h2>
          </div>
          
          <div className="instagram-reels-grid">
            {[
              { image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600", tag: "#MADMOODPOLO", likes: "4.8K", comments: "124" },
              { image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600", tag: "#SLUBLINEN", likes: "5.2K", comments: "98" },
              { image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600", tag: "#SPORTSWEAR", likes: "3.9K", comments: "145" },
              { image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600", tag: "#NAVYPIQUE", likes: "6.1K", comments: "210" },
              { image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600", tag: "#TERRYHOODIE", likes: "4.2K", comments: "115" },
              { image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600", tag: "#STREETWEAR", likes: "5.5K", comments: "167" }
            ].map((reel, idx) => (
              <div key={idx} className="reel-card">
                <img 
                  src={reel.image} 
                  alt="Menswear Editorial" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="reel-overlay">
                  <span style={{ fontSize: '0.6rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.15em', display: 'block', marginBottom: '2px' }}>@MADMOOD.IN</span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{reel.tag}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ♥ {reel.likes}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      💬 {reel.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SESSION-BASED PROMO POPUP MODAL */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              borderRadius: '0px',
              overflow: 'hidden',
              background: '#ffffff',
              maxWidth: '750px',
              width: '90%',
              boxShadow: 'var(--shadow-hover)',
              position: 'relative',
              border: '1px solid var(--color-black)',
              animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              {/* Close button */}
              <button
                onClick={handleDismissPopup}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.8)',
                  border: 'none',
                  color: 'var(--color-black)',
                  padding: '4px',
                  borderRadius: '50%',
                  zIndex: 20,
                  cursor: 'pointer'
                }}
                title="Close"
              >
                <X size={20} />
              </button>

              {/* Image column */}
              <div style={{
                width: '45%',
                minWidth: '220px',
                background: `url("${popupSettings?.image || 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=500'}") no-repeat center center`,
                backgroundSize: 'cover',
                display: 'block'
              }} className="no-print mobile-popup-img" />

              {/* Text content column */}
              <div style={{
                flex: 1,
                padding: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {!popupSubmitted ? (
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      EXCLUSIVE INVITATION
                    </span>
                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '8px 0 12px 0', lineHeight: '1.25', color: '#000' }}>
                      {popupSettings?.title || 'JOIN THE MAD CLUB'}
                    </h3>
                    <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      {popupSettings?.text || 'Subscribe to our premium launch lists. Get early drop alerts, exclusive catalogs, and FLAT 15% OFF on your first order.'}
                    </p>

                    <form onSubmit={handlePopupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          placeholder="ENTER EMAIL ADDRESS..."
                          value={popupEmail}
                          onChange={(e) => setPopupEmail(e.target.value)}
                          required
                          style={{
                            width: '100%',
                            border: '1px solid var(--color-gray-border)',
                            borderRadius: '0px',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            fontSize: '0.85rem',
                            outline: 'none',
                            fontFamily: 'var(--font-body)'
                          }}
                        />
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
                      </div>
                      <button
                        type="submit"
                        className="btn-accent-m"
                        style={{
                          padding: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          borderRadius: '0px',
                          width: '100%'
                        }}
                      >
                        RECEIVE CODE <Send size={12} />
                      </button>
                    </form>
                    
                    <button 
                      onClick={handleDismissPopup}
                      style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-text)', textDecoration: 'underline', fontSize: '0.75rem', marginTop: '1.25rem', cursor: 'pointer' }}
                    >
                      No thanks, I prefer regular pricing
                    </button>
                  </div>
                ) : (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <CheckCircle size={44} color="var(--color-gold)" style={{ margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '8px', color: '#000' }}>
                      WELCOME TO THE CLIQUE
                    </h3>
                    <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                      Your subscription is recorded. Use the coupon code below at checkout to redeem your savings:
                    </p>

                    <div style={{
                      border: '2px dashed var(--color-gold)',
                      background: 'var(--bg-gray-light)',
                      padding: '1rem',
                      borderRadius: '0px',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      color: 'var(--color-gold)',
                      marginBottom: '1.5rem',
                      position: 'relative'
                    }}>
                      {popupSettings?.promoCode || 'MOOD15'}
                    </div>

                    <button
                      onClick={() => setShowPopup(false)}
                      className="btn-accent-m"
                      style={{ width: '100%', borderRadius: '0px', padding: '0.7rem' }}
                    >
                      START SHOPPING
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}

      <style>{`
        .carousel-btn-hover:hover {
          background: var(--color-gold) !important;
          color: var(--color-black) !important;
        }
        .cat-circle:hover {
          transform: scale(1.06);
        }
        .gram-img-m:hover {
          transform: scale(1.03);
          box-shadow: var(--shadow-medium);
        }
        
        /* Swiper carousel navigation arrows overrides */
        .product-carousel-swiper .swiper-button-next,
        .product-carousel-swiper .swiper-button-prev {
          color: var(--color-black) !important;
          background: rgba(255, 255, 255, 0.95) !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 0px !important;
          border: 1px solid var(--color-gray-border) !important;
          box-shadow: var(--shadow-subtle) !important;
          transition: all 0.3s ease !important;
        }
        .product-carousel-swiper .swiper-button-next:hover,
        .product-carousel-swiper .swiper-button-prev:hover {
          background: var(--color-gold) !important;
          border-color: var(--color-gold) !important;
          color: var(--color-black) !important;
        }
        .product-carousel-swiper .swiper-button-next::after,
        .product-carousel-swiper .swiper-button-prev::after {
          font-size: 12px !important;
          font-weight: 800 !important;
        }
        
        /* Swiper bullets styling overrides */
        .swiper-pagination-custom {
          display: flex !important;
          justify-content: center;
          gap: 8px;
        }
        .custom-bullet {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .custom-bullet-active {
          width: 24px !important;
          background: #ffffff !important;
        }
        
        /* Cinematic Slow Image Zoom */
        .hero-slide-image {
          transition: transform 5.5s ease-out !important;
          transform: scale(1.0) !important;
        }
        .swiper-slide-active .hero-slide-image {
          transform: scale(1.08) !important;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .editorial-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Home;
