import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductById, createOrder, updateUserAddress } from '../services/db';
import type { Address, Order } from '../services/db';
import { Lock, Smartphone, CheckCircle2, ShieldCheck, X, Loader2 } from 'lucide-react';
import { apiCreateRazorpayOrder, apiVerifyRazorpaySignature } from '../services/razorpayBackend';

export const Checkout: React.FC = () => {
  const { cart, currentUser, clearAllCart, refreshUser } = useApp();
  const navigate = useNavigate();

  // Address form fields
  const [shippingLabel, setShippingLabel] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment details (COD or Online)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');

  // Razorpay secure checkout loader overlay state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingStep, setVerifyingStep] = useState<'creating' | 'waiting' | 'verifying' | 'success' | 'failed'>('waiting');

  // Applied Promo Cached
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  // Address book picker
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Pincode Checker state variables
  const [checkPincode, setCheckPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isPincodeValid, setIsPincodeValid] = useState<boolean | null>(null);

  const handlePincodeCheck = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanPin = checkPincode.trim();
    if (/^\d{6}$/.test(cleanPin)) {
      setIsPincodeValid(true);
      setPincodeStatus(`✅ Delivery available to ${cleanPin}. Estimated delivery: 2-4 business days via Express Courier. COD supported.`);
      setPincode(cleanPin); // autofill pincode field
    } else {
      setIsPincodeValid(false);
      setPincodeStatus('❌ Invalid pincode. Please enter a valid 6-digit Indian pincode.');
    }
  };

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/shop');
      return;
    }

    if (!currentUser) {
      navigate('/auth?redirect=checkout');
      return;
    }

    const isProfileComplete = currentUser.phone && currentUser.city && currentUser.state && currentUser.pincode;
    if (!currentUser.isEmailVerified || !currentUser.isPhoneVerified || !isProfileComplete) {
      navigate('/verify?redirect=checkout');
      return;
    }

    // Load discount cache
    const promo = localStorage.getItem('mmi_applied_promo');
    if (promo) {
      setAppliedPromo(JSON.parse(promo));
    }

    // Auto-fill first address if logged in
    if (currentUser.addresses && currentUser.addresses.length > 0) {
      const firstAddr = currentUser.addresses[0];
      setSelectedAddressId(firstAddr.id);
      applySavedAddress(firstAddr);
    }
  }, [currentUser, cart, navigate]);

  const applySavedAddress = (addr: Address) => {
    setShippingLabel(addr.label);
    setStreetAddress(addr.streetAddress);
    setLocality(addr.locality);
    setCity(addr.city);
    setState(addr.state || '');
    setPincode(addr.pincode);
    setPhone(addr.phone);
  };

  const handleSavedAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (currentUser && currentUser.addresses) {
      const matched = currentUser.addresses.find(a => a.id === id);
      if (matched) {
        applySavedAddress(matched);
      }
    }
  };

  // Math
  const resolvedItems = cart.map(item => {
    const product = getProductById(item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = resolvedItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const gstAmount = Math.round(subtotal * 0.18);
  const cgstAmount = Math.round(gstAmount / 2);
  const sgstAmount = gstAmount - cgstAmount;
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.hasOwnProperty('Razorpay')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const executeOrderPlacement = (
    method: Order['paymentMethod'],
    status: Order['status'],
    rzpOrderId?: string,
    rzpPaymentId?: string,
    rzpSignature?: string
  ) => {
    let chosenAddress: Address = {
      id: 'addr_temp',
      label: shippingLabel,
      streetAddress,
      locality,
      city,
      state,
      pincode,
      phone
    };

    if (currentUser && !selectedAddressId) {
      if (window.confirm('PROFILE MANAGER: Save these delivery details inside your profile?')) {
        const saved = updateUserAddress({
          label: shippingLabel,
          streetAddress,
          locality,
          city,
          state,
          pincode,
          phone
        });
        if (saved.length > 0) {
          chosenAddress = saved[saved.length - 1];
        }
        refreshUser();
      }
    } else if (currentUser && selectedAddressId) {
      const match = currentUser.addresses.find(a => a.id === selectedAddressId);
      if (match) chosenAddress = match;
    }

    const newOrder = createOrder(
      resolvedItems as any,
      subtotal,
      discount,
      gstAmount,
      shipping,
      total,
      chosenAddress,
      method,
      status,
      rzpOrderId,
      rzpPaymentId,
      rzpSignature
    );

    localStorage.removeItem('mmi_applied_promo');
    clearAllCart();
    navigate(`/order-tracking/${newOrder.id}`);
  };

  const handleRazorpayCheckout = async () => {
    setIsVerifying(true);
    setVerifyingStep('creating');

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('GATEWAY ERROR: Failed to load Razorpay payment gateway script. Please check your internet connection.');
        setIsVerifying(false);
        return;
      }

      const simulatedRzpOrder = await apiCreateRazorpayOrder(total);
      setVerifyingStep('waiting');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_MADMOODMOCK12',
        amount: simulatedRzpOrder.amount,
        currency: simulatedRzpOrder.currency,
        name: 'MAD MOOD',
        description: 'Premium Menswear Checkout',
        order_id: simulatedRzpOrder.id,
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=120',
        prefill: {
          name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest Customer',
          email: currentUser?.email || 'customer@madmood.in',
          contact: phone
        },
        notes: {
          address: `${streetAddress}, ${locality}, ${city}, ${state} - ${pincode}`
        },
        theme: {
          color: '#0A1D37'
        },
        handler: async (response: any) => {
          setVerifyingStep('verifying');
          
          const isValid = await apiVerifyRazorpaySignature(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );

          if (isValid) {
            setVerifyingStep('success');
            setTimeout(() => {
              executeOrderPlacement(
                'Online',
                'Paid',
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
              setIsVerifying(false);
            }, 1000);
          } else {
            setVerifyingStep('failed');
            alert('SECURITY ERROR: Cryptographic signature verification failed.');
            setIsVerifying(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed by user');
            setIsVerifying(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        alert(`TRANSACTION FAILED: ${resp.error.description || 'Payment failed. Please try again.'}`);
        setIsVerifying(false);
      });

      rzp.open();

    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      alert('GATEWAY FAILURE: Unable to trigger Razorpay checkout.');
      setIsVerifying(false);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim() || !locality.trim() || !city.trim() || !pincode.trim() || !phone.trim()) {
      alert('REQUIRED FIELD CHECK: Please fill in all shipping fields.');
      return;
    }

    if (paymentMethod === 'Online') {
      handleRazorpayCheckout();
    } else {
      executeOrderPlacement('COD', 'Pending');
      alert('ORDER PLACED: Cash on Delivery order recorded successfully. Opening Order Tracking.');
    }
  };

  return (
    <div style={{ padding: '4.5rem 0', minHeight: 'calc(100vh - 200px)', backgroundColor: 'var(--bg-white)' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ marginBottom: '3.5rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-primary)', letterSpacing: '0.2em', fontWeight: 700 }}>
            SECURE CHECKOUT HUB
          </span>
          <h1 style={{ fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>DISPATCH BILLING</h1>
          <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginTop: '1rem' }} />
        </div>

        <form onSubmit={handleSubmitOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4.5rem' }} className="checkout-layout-grid">
          
          {/* Shipping Form & Payments */}
          <div>
            {/* Address selector if logged in */}
            {currentUser && currentUser.addresses && currentUser.addresses.length > 0 && (
              <div style={{ 
                padding: '1.5rem', 
                marginBottom: '2rem', 
                border: '1px solid var(--color-gray-border)',
                borderRadius: '0px',
                backgroundColor: 'var(--bg-gray-light)'
              }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em' }}>
                  LOAD PRE-SAVED PROFILE ADDRESS
                </label>
                <select
                  value={selectedAddressId}
                  onChange={handleSavedAddressChange}
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--color-gray-border)',
                    padding: '0.65rem',
                    color: 'var(--color-black)',
                    fontFamily: 'var(--font-body)',
                    outline: 'none',
                    borderRadius: '0px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- ENTER A NEW DELIVERY ADDRESS --</option>
                  {currentUser.addresses.map(a => (
                    <option key={a.id} value={a.id}>{a.label.toUpperCase()} - {a.streetAddress}, {a.locality}</option>
                  ))}
                </select>
              </div>
            )}

            {/* PIN Code Checker */}
            <div style={{ 
              padding: '2rem', 
              marginBottom: '2.5rem', 
              border: '1px solid var(--color-gray-border)',
              borderRadius: '0px',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em' }}>
                PIN CODE CHECKER
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', marginBottom: '1rem', lineHeight: '1.4' }}>
                Check estimated delivery dates and COD availability in your region before filling details.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="ENTER 6-DIGIT PIN CODE..."
                  value={checkPincode}
                  onChange={(e) => setCheckPincode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    flexGrow: 1,
                    background: '#ffffff',
                    border: '1px solid var(--color-gray-border)',
                    padding: '0.65rem 0.75rem',
                    color: '#000000',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    borderRadius: '0px',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={handlePincodeCheck}
                  className="btn-primary-m"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.75rem' }}
                >
                  CHECK
                </button>
              </div>
              {pincodeStatus && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isPincodeValid ? 'var(--color-success)' : '#ff1d40',
                  padding: '8px 12px',
                  background: isPincodeValid ? 'rgba(43, 138, 62, 0.05)' : 'rgba(255, 29, 64, 0.05)',
                  border: isPincodeValid ? '1px solid var(--color-success)' : '1px solid #ff1d40'
                }}>
                  {pincodeStatus}
                </div>
              )}
            </div>

            {/* Shipping forms details */}
            <div style={{ 
              padding: '2rem', 
              marginBottom: '2.5rem', 
              border: '1px solid var(--color-gray-border)',
              borderRadius: '0px',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em' }}>
                SHIPPING DETAILS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>ADDRESS NICKNAME</label>
                    <input type="text" value={shippingLabel} onChange={(e) => setShippingLabel(e.target.value)} style={inputStyle} placeholder="e.g. Home, Office" disabled={!!selectedAddressId} required />
                  </div>
                  <div>
                    <label style={labelStyle}>PHONE / CELL CONTACT</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="10-digit number" disabled={!!selectedAddressId} required />
                  </div>
                </div>

                 <div>
                  <label style={labelStyle}>STREET ADDRESS</label>
                  <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} style={inputStyle} placeholder="Flat, House no., Building, Apartment" disabled={!!selectedAddressId} required />
                </div>

                <div>
                  <label style={labelStyle}>LOCALITY / AREA</label>
                  <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} style={inputStyle} placeholder="Locality, Sector, Area" disabled={!!selectedAddressId} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>CITY</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} placeholder="Unnao" disabled={!!selectedAddressId} required />
                  </div>
                  <div>
                    <label style={labelStyle}>STATE</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} placeholder="Uttar Pradesh" disabled={!!selectedAddressId} required />
                  </div>
                  <div>
                    <label style={labelStyle}>PINCODE</label>
                    <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} style={inputStyle} placeholder="209801" disabled={!!selectedAddressId} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment options */}
            <div style={{ 
              padding: '2rem', 
              border: '1px solid var(--color-gray-border)',
              borderRadius: '0px',
              backgroundColor: '#ffffff',
              marginBottom: '2.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em' }}>
                SELECT PAYMENT METHOD
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    flex: 1,
                    background: paymentMethod === 'COD' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    border: '1.5px solid',
                    borderColor: paymentMethod === 'COD' ? 'var(--color-gold)' : 'var(--color-gray-border)',
                    color: 'var(--color-black)',
                    padding: '0.85rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '0px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  CASH ON DELIVERY (COD)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Online')}
                  style={{
                    flex: 1,
                    background: paymentMethod === 'Online' ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    border: '1.5px solid',
                    borderColor: paymentMethod === 'Online' ? 'var(--color-gold)' : 'var(--color-gray-border)',
                    color: 'var(--color-black)',
                    padding: '0.85rem',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '0px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  ONLINE PAYMENT (RAZORPAY)
                </button>
              </div>

              {paymentMethod === 'Online' && (
                <div style={{
                  background: 'var(--bg-gray-light)',
                  padding: '1.25rem',
                  borderRadius: '0px',
                  border: '1px solid var(--color-gray-border)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: 'var(--color-gray-text)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <Smartphone size={20} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#000' }}>Secure Razorpay Checkout:</strong> Pay instantly using UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards (Visa, Mastercard, RuPay), Net Banking (all major Indian banks), or digital wallets.
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)', fontWeight: 500 }}>
                    <span>⚡ UPI / Cards / Net Banking / Wallets Supported</span>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>Real-time Gateway</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div style={{
                  background: 'var(--bg-gray-light)',
                  padding: '1.25rem',
                  borderRadius: '0px',
                  border: '1px solid var(--color-gray-border)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: 'var(--color-gray-text)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <Smartphone size={20} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#000' }}>Cash on Delivery (COD) Options:</strong> Place your order and pay when our delivery executive arrives. An extra service fee might apply. Please ensure cash or UPI is ready at delivery.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary Sidebar */}
          <div>
            <div style={{ 
              padding: '2rem', 
              backgroundColor: 'var(--bg-gray-light)',
              border: '1px solid var(--color-gray-border)',
              borderRadius: '0px',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em' }}>
                ORDER RECAP
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {resolvedItems.map(item => (
                  <div key={`${item.productId}-${item.selectedSize}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={item.product!.images[0]} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                      }}
                      style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '0px', border: '1px solid var(--color-gray-border)' }} 
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: '0.8rem', margin: 0, fontWeight: 700, color: 'var(--color-black)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{item.product!.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', margin: '2px 0 0 0' }}>
                        SIZE: {item.selectedSize} | QTY: {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-black)' }}>
                      ₹{(item.product!.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
 
              {/* Promo details */}
              {appliedPromo && (
                <div style={{
                  background: 'rgba(3, 166, 133, 0.06)',
                  border: '1px dashed var(--color-success)',
                  color: 'var(--color-success)',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  textAlign: 'center',
                  borderRadius: '0px',
                  marginBottom: '1.5rem'
                }}>
                  COUPON ACTIVE: {appliedPromo.code} (-₹{discount.toLocaleString('en-IN')})
                </div>
              )}
 
              {/* Calculations recap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>BAG TOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedPromo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                    <span>COUPON DISCOUNT</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>CGST (9% INCLUSIVE)</span>
                  <span>₹{cgstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>SGST (9% INCLUSIVE)</span>
                  <span>₹{sgstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>DELIVERY CHARGE</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  color: 'var(--color-black)',
                  borderTop: '1px solid var(--color-gray-border)',
                  paddingTop: '1rem',
                  marginTop: '6px'
                }}>
                  <span>TOTAL AMOUNT</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
 
              {/* Order place button */}
              <button
                type="submit"
                className="btn-accent-m"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '0px'
                }}
              >
                <Lock size={14} /> AUTHORIZE & PAY
              </button>

              <p style={{
                textAlign: 'center',
                color: 'var(--color-gray-text)',
                fontSize: '0.65rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontWeight: 500
              }}>
                <ShieldCheck size={12} color="var(--color-success)" /> SECURED BY 256-BIT SSL ENCRYPTIONS
              </p>
            </div>
          </div>

        </form>
      </div>

      {/* RAZORPAY GATEWAY PROGRESS OVERLAY */}
      {isVerifying && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(10, 29, 55, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: '440px',
            width: '90%',
            padding: '3rem 2rem',
            borderRadius: '0px',
            boxShadow: 'var(--shadow-hover)',
            textAlign: 'center',
            border: '1px solid var(--color-black)',
            position: 'relative'
          }}>
            {verifyingStep === 'creating' && (
              <div style={{ padding: '1.5rem 0' }}>
                <Loader2 size={36} className="spin-loader" color="var(--color-gold)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '6px' }}>INITIATING GATEWAY</h3>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>
                  Creating secure transaction ID on the Razorpay API grid...
                </p>
              </div>
            )}

            {verifyingStep === 'waiting' && (
              <div style={{ padding: '1.5rem 0' }}>
                <Loader2 size={36} className="spin-loader" color="var(--color-gold)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '6px' }}>WAITING FOR TRANSACTION</h3>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>
                  Please complete the payment in the Razorpay transaction sheet.
                </p>
              </div>
            )}

            {verifyingStep === 'verifying' && (
              <div style={{ padding: '1.5rem 0' }}>
                <Loader2 size={36} className="spin-loader" color="var(--color-gold)" style={{ margin: '0 auto 1.5rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '6px' }}>SECURE VERIFICATION</h3>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>
                  Performing cryptographic validation check of signature hashes...
                </p>
              </div>
            )}

            {verifyingStep === 'success' && (
              <div style={{ padding: '1rem 0' }}>
                <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '6px' }}>SETTLEMENT VERIFIED</h3>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>
                  Payment verified successfully. Recording order logs in database...
                </p>
              </div>
            )}

            {verifyingStep === 'failed' && (
              <div style={{ padding: '1rem 0' }}>
                <X size={48} color="#ff1d40" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '6px' }}>PAYMENT FAILED</h3>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>
                  Gateway signature validation failed. Please attempt verification again.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .spin-loader {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-gold)',
  fontWeight: 700,
  marginBottom: '6px',
  letterSpacing: '0.04em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '0.65rem 0.75rem',
  color: '#000000',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  borderRadius: '0px',
  boxSizing: 'border-box'
};
