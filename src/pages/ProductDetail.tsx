import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, addProductReview } from '../services/db';
import type { Product } from '../services/db';
import { useApp } from '../context/AppContext';
import { Star, Truck, ArrowLeft, Plus, Minus, Heart, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItemToCart, toggleWishlist, wishlist, currentUser } = useApp();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // Reviews submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Shipping details state
  const [zipCode, setZipCode] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState('');

  const isInWishlist = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    if (id) {
      const p = getProductById(id);
      setProduct(p);
      if (p) {
        setSelectedSize(p.sizes[0]);
        setActiveImageIdx(0);
        if (p.images.length > 0) {
          setCurrentImageUrl(p.images[0]);
        }
      }
    }
  }, [id]);

  useEffect(() => {
    if (product && product.images.length > activeImageIdx) {
      setCurrentImageUrl(product.images[activeImageIdx]);
    }
  }, [product, activeImageIdx]);


  if (!product) {
    return (
      <div style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2>PRODUCT NOT FOUND</h2>
        <p style={{ color: 'var(--color-gray-text)', margin: '1rem 0 2rem 0' }}>The product key you queried does not exist in the archive.</p>
        <Link to="/shop" className="btn-primary-m">BACK TO SHOP</Link>
      </div>
    );
  }

  // Zoom function
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // Submit reviews
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert('REQUIRED FIELDS: Please fill in your name and comment.');
      return;
    }
    const updated = addProductReview(product.id, reviewRating, reviewComment, reviewName);
    if (updated) {
      setProduct(updated);
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      alert('REVIEW SUBMITTED: Thank you for contributing to the MAD MOOD archives.');
    }
  };

  // Delivery check
  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim() || zipCode.length !== 6 || isNaN(Number(zipCode))) {
      alert('INVALID PINCODE: Please input a valid 6-digit Indian pincode (e.g. 400001).');
      return;
    }
    // Simulate lookup calculations based on zip
    const days = (parseInt(zipCode.substring(0, 2)) % 3) + 2; // 2 to 4 days
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateString = date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    setShippingEstimate(`DELIVERY ESTIMATE: ARRIVAL BY ${dateString.toUpperCase()} (${days} DAYS via MAD EXPRESS)`);
  };

  const avgRating = product.reviews.length
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : '4.8';

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleWishlistClick = () => {
    if (!currentUser) {
      alert('LOGIN REQUIRED: Please sign in to save products to your wishlist.');
      return;
    }
    toggleWishlist(product.id);
  };

  return (
    <div style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-white)' }}>
      <div className="container">
        
        {/* Back Link */}
        <Link to="/shop" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-gray-text)',
          textDecoration: 'none',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '3rem',
          width: 'max-content',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <ArrowLeft size={16} /> BACK TO THE SHOP ARCHIVE
        </Link>

        {/* Core Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginBottom: '6rem' }} className="product-detail-grid">
          
          {/* Images Gallery Column */}
          <div>
            {/* Active zoom box */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '125%', // 4:5 aspect ratio
                overflow: 'hidden',
                border: '1px solid var(--color-gray-border)',
                borderRadius: '8px',
                marginBottom: '1rem',
                cursor: 'zoom-in',
                background: '#f2f2f2'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageUrl}
                  src={currentImageUrl}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onError={() => {
                    setCurrentImageUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800');
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </AnimatePresence>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${currentImageUrl})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '200%',
                  pointerEvents: 'none',
                  ...zoomStyle
                }}
              />
            </div>

            {/* Thumbnails list */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {product.images.map((img, idx) => (
                <button
                   key={idx}
                   onClick={() => setActiveImageIdx(idx)}
                   style={{
                     width: '65px',
                     height: '80px',
                     border: '2px solid',
                     borderColor: activeImageIdx === idx ? 'var(--color-primary)' : 'var(--color-gray-border)',
                     background: 'transparent',
                     padding: 0,
                     overflow: 'hidden',
                     borderRadius: '4px',
                     cursor: 'pointer'
                   }}
                >
                  <img 
                    src={img} 
                    alt="" 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details / Product Controls Column */}
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-gray-text)', letterSpacing: '0.15em', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem 0', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--color-black)' }}>{product.name}</h1>

            {/* Rating display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', color: '#ffc107' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(parseFloat(avgRating)) ? '#ffc107' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-gray-dark)' }}>{avgRating} <span style={{ color: 'var(--color-gray-text)', fontWeight: 400 }}>({product.reviews.length || 15} reviews)</span></span>
            </div>

            {/* Pricing details */}
            <p style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', color: 'var(--color-black)', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              ₹{product.price.toLocaleString('en-IN')} 
              <span style={{ textDecoration: 'line-through', color: 'var(--color-gray-text)', fontSize: '1.1rem', fontWeight: 500 }}>₹{product.mrp.toLocaleString('en-IN')}</span>
              <span style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 700 }}>({discountPercent}% OFF)</span>
            </p>

            <p style={{ color: 'var(--color-gray-text)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
              {product.description}
            </p>

            {/* Sizing options */}
            {product.stock > 0 ? (
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  SELECT FIT / SIZE
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        background: selectedSize === size ? 'var(--color-primary)' : 'transparent',
                        color: selectedSize === size ? '#ffffff' : 'var(--color-black)',
                        border: '1px solid',
                        borderColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-gray-border)',
                        fontSize: '0.8rem',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        borderRadius: '4px',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Qty, Cart, and Wishlist Button Row */}
            {product.stock > 0 ? (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                
                {/* Quantity box */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-gray-border)',
                  padding: '2px',
                  borderRadius: '4px',
                  background: 'var(--bg-gray-light)'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-black)', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: '32px', textAlign: 'center', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-black)', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Add to Basket button */}
                <button
                  onClick={() => {
                    addItemToCart(product.id, quantity, selectedSize);
                    alert(`ADDED TO BASKET: ${quantity} x ${product.name} (Size: ${selectedSize}) added to your bag.`);
                  }}
                  className="btn-accent-m"
                  style={{ flexGrow: 1, padding: '0.85rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ADD TO BASKET
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={handleWishlistClick}
                  style={{
                    background: 'var(--bg-gray-light)',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: '4px',
                    padding: '0.85rem 1.25rem',
                    color: isInWishlist ? 'var(--color-primary)' : 'var(--color-black)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={isInWishlist ? 'var(--color-primary)' : 'none'} />
                </button>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                color: 'var(--color-gray-text)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                border: '1px solid var(--color-gray-border)',
                padding: '1rem',
                marginBottom: '3rem',
                borderRadius: '4px',
                fontWeight: 600,
                backgroundColor: 'var(--bg-gray-light)'
              }}>
                OUT OF STOCK IN ALL SIZES
              </div>
            )}

            {/* Delivery Pincode Estimator */}
            <div style={{ 
              padding: '1.25rem', 
              border: '1px solid var(--color-gray-border)', 
              borderRadius: 'var(--radius-md)',
              marginBottom: '2.5rem',
              backgroundColor: 'var(--bg-gray-light)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-heading)', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.02em' }}>
                <Truck size={14} /> CHECK DELIVERY SPEED
              </span>
              <form onSubmit={handleZipCheck} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="ENTER 6-DIGIT PINCODE (e.g. 400001)..."
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-gray-border)',
                    padding: '0.55rem 0.75rem',
                    color: 'var(--color-black)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    flexGrow: 1,
                    outline: 'none',
                    borderRadius: '4px'
                  }}
                />
                <button type="submit" className="btn-primary-m" style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                  CHECK
                </button>
              </form>
              {shippingEstimate && (
                <p style={{ color: 'var(--color-success)', fontSize: '0.75rem', fontFamily: 'var(--font-body)', marginTop: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> {shippingEstimate}
                </p>
              )}
            </div>

            {/* Specifications list */}
            <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '0.75rem', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-primary)' }}>TECHNICAL SPECIFICATIONS</h3>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                {product.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews panel */}
        <section style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }} className="product-reviews-grid">
            {/* Reviews display */}
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>VERIFIED CUSTOMER REVIEWS</h2>
              {product.reviews.length === 0 ? (
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>No reviews submitted for this apparel item yet. Be the first to share your thoughts!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {product.reviews.map(r => (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-black)' }}>{r.userName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>{r.date}</span>
                      </div>
                      <div style={{ display: 'flex', color: '#ffc107', marginBottom: '8px' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={10} fill={i < r.rating ? '#ffc107' : 'none'} />
                        ))}
                      </div>
                      <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.5' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write review form */}
            <div style={{ 
              padding: '2rem', 
              border: '1px solid var(--color-gray-border)', 
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-gray-light)',
              boxShadow: 'var(--shadow-subtle)',
              height: 'max-content'
            }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>SUBMIT PRODUCT FEEDBACK</h2>
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px' }}>
                    YOUR NAME / OPERATOR
                  </label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid var(--color-gray-border)',
                      padding: '0.65rem',
                      color: 'var(--color-black)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px' }}>
                    QUALITY EVALUATION (1-5 STARS)
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid var(--color-gray-border)',
                      padding: '0.65rem',
                      color: 'var(--color-black)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={5}>5 Stars (Optimal Fit & Material)</option>
                    <option value={4}>4 Stars (Very Good Quality)</option>
                    <option value={3}>3 Stars (Acceptable/Standard)</option>
                    <option value={2}>2 Stars (Subpar Fabric/Sewing)</option>
                    <option value={1}>1 Star (Defective/Return Candidate)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px' }}>
                    TECHNICAL OBSERVATIONS / FEEDBACK
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    required
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid var(--color-gray-border)',
                      padding: '0.65rem',
                      color: 'var(--color-black)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      borderRadius: '4px',
                      resize: 'none'
                    }}
                  />
                </div>

                 <button type="submit" className="btn-accent-m" style={{ padding: '0.75rem', borderRadius: '4px' }}>
                  TRANSMIT FEEDBACK LOG
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Responsive adjustments tag */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .product-reviews-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
};
export default ProductDetail;
