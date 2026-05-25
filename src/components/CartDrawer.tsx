import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductById } from '../services/db';
import { X, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, cartOpen, setCartOpen, updateItemQty, removeItemFromCart } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  if (!cartOpen) return null;

  // Resolve items
  const resolvedItems = cart.map(item => {
    const product = getProductById(item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  // Totals calculations
  const subtotal = resolvedItems.reduce((acc, item) => {
    return acc + (item.product!.price * item.quantity);
  }, 0);

  // GST Calculation (18% inclusive in retail prices, let's show breakdown: 18% of subtotal)
  const gstAmount = Math.round(subtotal * 0.18);
  
  // Promo logic
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = couponInput.trim().toUpperCase();
    if (code === 'MADINDIAN') {
      if (subtotal < 999) {
        setPromoError('MINIMUM PURCHASE REQUIRED: Code MADINDIAN requires order value above ₹999.');
      } else {
        setAppliedPromo({ code: 'MADINDIAN', discount: 200 });
        setCouponInput('');
      }
    } else if (code === 'MOOD15') {
      setAppliedPromo({ code: 'MOOD15', discount: Math.round(subtotal * 0.15) });
      setCouponInput('');
    } else {
      setPromoError('INVALID COUPON: The code entered is invalid.');
    }
  };

  const discount = appliedPromo 
    ? (appliedPromo.code === 'MOOD15' ? Math.round(subtotal * 0.15) : appliedPromo.discount) 
    : 0;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99; // Free above ₹999
  const total = subtotal - discount + shipping;

  const handleCheckoutRedirect = () => {
    setCartOpen(false);
    if (appliedPromo) {
      // Save promo with calculated discount for checkout persistence
      localStorage.setItem('mmi_applied_promo', JSON.stringify({
        code: appliedPromo.code,
        discount: discount
      }));
    } else {
      localStorage.removeItem('mmi_applied_promo');
    }
    navigate('/checkout');
  };

  return (
    <div
      className="cart-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'flex-end',
        transition: 'all 0.3s ease'
      }}
      onClick={() => setCartOpen(false)}
    >
      <div
        className="cart-container"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          animation: 'slideInRight 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-gray-border)',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            SHOPPING BAG ({resolvedItems.length})
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-black)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items Grid */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingRight: '0.25rem',
          marginBottom: '1rem'
        }}>
          {resolvedItems.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--color-gray-text)',
              textAlign: 'center'
            }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                YOUR BAG IS EMPTY
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/shop');
                }}
                className="btn-primary-m"
              >
                EXPLORE ITEMS
              </button>
            </div>
          ) : (
            resolvedItems.map(item => (
              <div
                key={`${item.productId}-${item.selectedSize}`}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: '1px solid var(--color-gray-border)'
                }}
              >
                <img
                  src={item.product!.images[0]}
                  alt={item.product!.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                  }}
                  style={{
                    width: '65px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid var(--color-gray-border)'
                  }}
                />

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '0.8rem', margin: '0 0 3px 0', fontWeight: 600 }}>{item.product!.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', marginBottom: '8px' }}>
                    SIZE: <strong style={{ color: 'var(--color-black)' }}>{item.selectedSize}</strong>
                  </span>

                  {/* Qty Shift controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-gray-border)',
                      borderRadius: '4px',
                      background: '#fff'
                    }}>
                      <button
                        onClick={() => updateItemQty(item.productId, item.selectedSize, item.quantity - 1)}
                        style={{ background: 'transparent', border: 'none', padding: '2px 8px', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={10} />
                      </button>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, width: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItemQty(item.productId, item.selectedSize, item.quantity + 1)}
                        style={{ background: 'transparent', border: 'none', padding: '2px 8px', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItemFromCart(item.productId, item.selectedSize)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-gray-text)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={13} className="hover-red-text" />
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.85rem' }}>
                  ₹{(item.product!.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculations footer */}
        {resolvedItems.length > 0 && (
          <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
            
            {/* Promo Code input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="ENTER COUPON (e.g., MADINDIAN)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                style={{
                  border: '1px solid var(--color-gray-border)',
                  borderRadius: '4px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  flexGrow: 1,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-primary-m"
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
              >
                APPLY
              </button>
            </form>

            {promoError && (
              <p style={{ color: 'var(--color-primary)', fontSize: '0.7rem', marginTop: '-0.75rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                {promoError}
              </p>
            )}

            {appliedPromo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(3, 166, 133, 0.08)',
                border: '1px solid var(--color-success)',
                padding: '6px 12px',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.75rem',
                color: 'var(--color-success)',
                fontWeight: 600
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={12} /> {appliedPromo.code} APPLIED (Saved ₹{appliedPromo.discount})
                </span>
                <button
                  onClick={() => setAppliedPromo(null)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)', fontWeight: 700 }}
                >
                  REMOVE
                </button>
              </div>
            )}

            {/* Calculations layout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                <span>BAG TOTAL</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedPromo && (
                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>COUPON DISCOUNT</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                <span>GST (INCLUDED 18%)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                <span>DELIVERY CHARGE</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'var(--color-black)',
                borderTop: '1px solid var(--color-gray-border)',
                paddingTop: '0.75rem',
                marginTop: '4px'
              }}>
                <span>TOTAL AMOUNT</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckoutRedirect}
              className="btn-accent-m"
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: '4px'
              }}
            >
              PROCEED TO SECURE CHECKOUT <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .hover-red-text:hover {
          color: var(--color-primary) !important;
        }
      `}</style>
    </div>
  );
};
export default CartDrawer;
