import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../services/db';
import { useApp } from '../context/AppContext';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { toggleWishlist, wishlist, currentUser, addItemToCart } = useApp();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [hovered, setHovered] = useState(false);

  const isInWishlist = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('LOGIN REQUIRED: Please sign in to save products to your wishlist.');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItemToCart(product.id, 1, selectedSize);
  };

  // Average review rating mockup
  const avgRating = product.reviews.length
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : '4.2';

  return (
    <div
      className="premium-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '8px'
      }}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          color: isInWishlist ? 'var(--color-gold)' : 'var(--color-black)',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}
        title="Add to Wishlist"
      >
        <Heart size={16} fill={isInWishlist ? 'var(--color-gold)' : 'none'} strokeWidth={2} />
      </button>

      {/* Image container */}
      <Link to={`/product/${product.id}`} style={{
        display: 'block',
        position: 'relative',
        paddingTop: '125%', // 4:5 aspect ratio
        overflow: 'hidden',
        background: '#f2f2f2'
      }}>
        {/* Badges Overlay */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {product.isBestSeller && (
            <span style={{
              background: 'var(--color-gold)',
              color: 'var(--color-black)',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '3px 8px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              BEST SELLER
            </span>
          )}
          {product.stock > 0 && product.stock <= 20 && (
            <span style={{
              background: '#000000',
              color: 'var(--color-gold)',
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '3px 8px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              LIMITED STOCK
            </span>
          )}
        </div>

        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            opacity: hovered && product.images[1] ? 0 : 1,
            zIndex: 1
          }}
        />

        {/* Alternate Image (Crossfade hover view) */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} view 2`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              opacity: hovered ? 1 : 0,
              zIndex: 2
            }}
          />
        )}

        {/* Dynamic Ratings Badge (Myntra style) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '2px 6px',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--color-black)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          zIndex: 5
        }}>
          {avgRating} <Star size={10} fill="var(--color-black)" />
          <span style={{ color: 'var(--color-gray-text)', borderLeft: '1px solid #ddd', paddingLeft: '4px' }}>
            {product.reviews.length || 15}
          </span>
        </div>

        {/* Quick View banner overlay on hover */}
        {hovered && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            padding: '8px 0',
            animation: 'slideUp 0.2s ease',
            borderTop: '1px solid var(--color-gray-border)',
            zIndex: 5
          }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-black)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Eye size={12} /> QUICK VIEW
            </button>
          </div>
        )}
      </Link>

      {/* Info Content details */}
      <div style={{
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        background: '#fff'
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.65rem',
          color: 'var(--color-gray-text)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '3px'
        }}>{product.category}</span>

        <Link to={`/product/${product.id}`} style={{
          textDecoration: 'none',
          color: 'var(--color-black)',
          marginBottom: '6px'
        }}>
          <h3 style={{
            fontSize: '0.85rem',
            margin: 0,
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}>{product.name}</h3>
        </Link>

        {/* Pricing Layout */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          flexWrap: 'wrap',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-black)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', textDecoration: 'line-through' }}>
            MRP ₹{product.mrp.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700 }}>
            ({discountPercent}% OFF)
          </span>
        </div>

        {/* Size Picker for instant addition */}
        {product.stock > 0 ? (
          <div style={{ marginTop: 'auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              borderTop: '1px dashed var(--color-gray-border)',
              paddingTop: '8px'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', fontWeight: 600 }}>SIZE</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      background: selectedSize === size ? 'var(--color-black)' : 'transparent',
                      color: selectedSize === size ? '#fff' : 'var(--color-black)',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--color-black)' : 'var(--color-gray-border)',
                      fontSize: '0.65rem',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      borderRadius: '0px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-accent-m"
              style={{
                width: '100%',
                padding: '6px 0',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '0px'
              }}
            >
              <ShoppingCart size={12} /> ADD TO CART
            </button>
          </div>
        ) : (
          <div style={{
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--color-gray-text)',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            border: '1px solid var(--color-gray-border)',
            padding: '6px 0',
            borderRadius: '0px'
          }}>
            OUT OF STOCK
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
