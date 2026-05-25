import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateSimulatedOrderStatus } from '../services/db';
import type { Order } from '../services/db';
import { Check, Search, FileText, Printer, ArrowRight } from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  
  // Custom lookup query input
  const [lookupVal, setLookupVal] = useState('');
  const [queryError, setQueryError] = useState('');

  useEffect(() => {
    // Run simulated updates to show status movement over loads
    updateSimulatedOrderStatus();
    
    if (id) {
      const match = getOrderById(id);
      setOrder(match);
      if (!match) {
        setQueryError('NO RECORD FOUND: Order code does not map to active files.');
      } else {
        setQueryError('');
      }
    }
  }, [id]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupVal.trim()) {
      navigate(`/order-tracking/${encodeURIComponent(lookupVal.trim())}`);
      setLookupVal('');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const statusSteps: Order['status'][] = ['Pending', 'Paid', 'Shipped', 'Delivered'];
  const statusLabels: Record<Order['status'], string> = {
    'Pending': 'PAYMENT PENDING / CASH ON DELIVERY',
    'Paid': 'ORDER PAID & CONFIRMED',
    'Failed': 'PAYMENT FAILED',
    'Shipped': 'DISPATCHED IN TRANSIT',
    'Delivered': 'DELIVERED SECURELY',
    'Cancelled': 'ORDER CANCELLED'
  };

  const getStepIndex = (status: Order['status']) => {
    const idx = statusSteps.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div style={{ padding: '4.5rem 0', minHeight: 'calc(100vh - 200px)', backgroundColor: 'var(--bg-white)' }}>
      <div className="container print-area">
        
        {/* Printable CSS overrides embedded */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
              background: white !important;
              color: black !important;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .invoice-sheet-container {
              border: 1px solid #000 !important;
              padding: 20px !important;
              background: #ffffff !important;
              box-shadow: none !important;
            }
          }
        `}</style>

        {/* Header (No print if page is printing) */}
        <div className="no-print" style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-primary)', letterSpacing: '0.2em', fontWeight: 700 }}>
              DISPATCH COURIER TELEMETRY
            </span>
            <h1 style={{ fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>ORDER TRACKING</h1>
            <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginTop: '0.75rem' }} />
          </div>

          {/* Quick Lookup form */}
          <form onSubmit={handleLookupSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="ENTER ORDER ID (e.g. MM-IND-123456)..."
              value={lookupVal}
              onChange={(e) => setLookupVal(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--color-gray-border)',
                padding: '0.55rem 0.75rem',
                color: 'var(--color-black)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                outline: 'none',
                borderRadius: '4px',
                width: '240px'
              }}
            />
            <button type="submit" className="btn-primary-m" style={{ padding: '0.55rem 1.25rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '4px' }}>
              <Search size={12} /> LOOKUP
            </button>
          </form>
        </div>

        {/* If no order details loaded yet */}
        {!order ? (
          <div style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            maxWidth: '600px', 
            margin: '0 auto',
            border: '1px solid var(--color-gray-border)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-gray-light)'
          }}>
            <Search size={32} color="var(--color-primary)" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>TRACK YOUR DESIRED DISPATCH</h2>
            <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Enter your unique order tracking code or transaction token (e.g. MM-IND-100224) inside the search form above to fetch live courier transit progress.
            </p>
            {queryError && (
              <p style={{ color: '#ff1d40', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, margin: '1rem 0' }}>
                {queryError}
              </p>
            )}
          </div>
        ) : (
          /* Active Order Tracking view */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Top overview card */}
            <div style={{
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              border: '1px solid var(--color-gray-border)',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-gray-light)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gray-text)', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>ORDER IDENTIFICATION</span>
                <h2 style={{ fontSize: '1.5rem', margin: '2px 0 6px 0', color: 'var(--color-black)', fontFamily: 'var(--font-heading)', fontWeight: 900 }}>
                  {order.id}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)' }}>
                  COURIER TRACKING: <strong style={{ color: 'var(--color-primary)' }}>{order.trackingNumber}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }} className="d-md-right">
                <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-text)', fontWeight: 700 }}>ESTIMATED STATUS</p>
                <p style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontWeight: 900, margin: '2px 0 6px 0' }}>
                  {statusLabels[order.status]}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                  UPDATED: {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {order.status === 'Cancelled' && (
              <div style={{
                background: 'rgba(255, 29, 64, 0.08)',
                border: '1.5px solid #ff1d40',
                color: '#ff1d40',
                padding: '1.25rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                marginBottom: '2rem'
              }}>
                ALERT: THIS TRANSACTION HAS BEEN CANCELLED AND VOIDED. NO SHIPMENT DISPATCH WILL BE PROCESSED.
              </div>
            )}

            {/* Timeline Progress Bar Grid */}
            <div style={{ 
              padding: '3rem 2rem', 
              border: '1px solid var(--color-gray-border)', 
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ffffff'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'relative',
                flexWrap: 'wrap',
                gap: '2rem'
              }} className="timeline-grid-wrapper">
                
                {/* Horizontal progress bar line (Desktop) */}
                <div className="no-print" style={{
                  position: 'absolute',
                  top: '16px',
                  left: '30px',
                  width: 'calc(100% - 60px)',
                  height: '2px',
                  background: 'var(--color-gray-border)',
                  zIndex: 1
                }} />

                {/* Filled horizontal progress bar */}
                <div className="no-print" style={{
                  position: 'absolute',
                  top: '16px',
                  left: '30px',
                  width: `calc((${(getStepIndex(order.status) / (statusSteps.length - 1)) * 100}%) - 60px)`,
                  height: '2px',
                  background: 'var(--color-primary)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 2
                }} />

                {/* Steps */}
                {statusSteps.map((step, idx) => {
                  const isActive = idx <= getStepIndex(order.status);
                  const isCurrent = idx === getStepIndex(order.status);

                  return (
                    <div
                      key={step}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 3,
                        position: 'relative',
                        flex: 1,
                        minWidth: '100px'
                      }}
                    >
                      {/* Check Node circle */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isActive ? 'var(--color-primary)' : '#ffffff',
                        border: '2px solid',
                        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-gray-border)',
                        color: isActive ? '#ffffff' : 'var(--color-gray-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        transition: 'all 0.3s ease'
                      }}>
                        {idx < getStepIndex(order.status) ? <Check size={14} strokeWidth={3} /> : <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)' }}>{idx + 1}</span>}
                      </div>

                      {/* Labels */}
                      <h4 style={{
                        fontSize: '0.75rem',
                        marginTop: '12px',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-gray-text)',
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'center',
                        letterSpacing: '0.05em'
                      }}>
                        {statusLabels[step]}
                      </h4>
                      <p style={{
                        fontSize: '0.65rem',
                        color: 'var(--color-success)',
                        textAlign: 'center',
                        marginTop: '2px',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700
                      }}>
                        {isCurrent ? 'ACTIVE PHASE' : ''}
                      </p>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Print Invoice details sheet */}
            <div 
              className="invoice-sheet-container"
              style={{ 
                padding: '3rem', 
                border: '1px solid var(--color-gray-border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#ffffff',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>
                    <FileText size={18} /> TAX INVOICE
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>Official Commercial Invoice // GSTIN: 27AAMCM6812H1Z4</span>
                </div>
                
                {/* Print button */}
                <button
                  onClick={handlePrintInvoice}
                  className="btn-primary-m no-print"
                  style={{
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '4px'
                  }}
                >
                  <Printer size={12} /> PRINT INVOICE
                </button>
              </div>

              {/* Invoice Layout Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }} className="invoice-details-grid">
                
                {/* Shipping Address */}
                <div>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>DELIVER TO</h4>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000', margin: 0 }}>{order.shippingAddress.label.toUpperCase()}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>{order.shippingAddress.streetAddress}, {order.shippingAddress.locality}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: 0 }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-black)', marginTop: '8px', fontWeight: 600 }}>CONTACT: {order.shippingAddress.phone}</p>
                </div>

                {/* Billing info */}
                <div style={{ textAlign: 'right' }} className="d-md-right">
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>INVOICE DETAILS</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>
                    INVOICE NO: <strong style={{ color: '#000' }}>{order.id.replace('MM-IND-', 'INV-MM-')}</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>
                    TRANSACTION ID: <strong style={{ color: '#000' }}>{order.trackingNumber}</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>
                    DATE: {new Date(order.date).toLocaleString('en-IN')}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>
                    PAYMENT METHOD: <strong style={{ color: '#000' }}>{order.paymentMethod === 'Online' ? 'Online (Razorpay)' : order.paymentMethod}</strong>
                  </p>
                  {order.razorpayPaymentId && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '4px 0' }}>
                      RAZORPAY PAYMENT ID: <strong style={{ color: 'var(--color-primary)' }}>{order.razorpayPaymentId}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Invoice Products list */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0', color: 'var(--color-primary)', fontWeight: 700 }}>ITEM DESCRIPTION</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--color-primary)', fontWeight: 700, textAlign: 'center' }}>SIZE</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--color-primary)', fontWeight: 700, textAlign: 'center' }}>QTY</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--color-primary)', fontWeight: 700, textAlign: 'right' }}>RATE</th>
                    <th style={{ padding: '0.75rem 0', color: 'var(--color-primary)', fontWeight: 700, textAlign: 'right' }}>NET AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--color-black)' }}>{item.product.name}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'center' }}>{item.size}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{item.priceAtPurchase.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '1rem 0', textAlign: 'right', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                        ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations footer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '250px', marginLeft: 'auto', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>BAG SUBTOTAL</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                    <span>DISCOUNT APPLIED</span>
                    <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>CGST (9%)</span>
                  <span>₹{Math.round(order.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>SGST (9%)</span>
                  <span>₹{Math.round(order.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-gray-text)' }}>
                  <span>SHIPPING CHARGE</span>
                  <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: 'var(--color-black)',
                  borderTop: '2px solid var(--color-primary)',
                  paddingTop: '0.85rem',
                  marginTop: '6px'
                }}>
                  <span>TOTAL CHARGED</span>
                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Tax terms footnotes */}
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem', fontSize: '0.75rem', color: 'var(--color-gray-text)', textAlign: 'center', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--color-black)' }}>MAD MOOD</p>
                <p style={{ margin: '0 0 2px 0' }}>Unnao, Uttar Pradesh, India - 209801</p>
                <p style={{ margin: '0 0 6px 0' }}>Contact: +91 6386376901</p>
                <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.8 }}>This is a computer-generated tax invoice and does not require a physical signature. Subject to Unnao, Uttar Pradesh jurisdiction.</p>
              </div>

            </div>

            {/* Back to Home CTA */}
            <div className="no-print" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => navigate('/')} 
                className="btn-accent-m"
                style={{ borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                RETURN TO HOME <ArrowRight size={14} />
              </button>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-grid-wrapper {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .timeline-grid-wrapper::after {
            display: none;
          }
          .invoice-details-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .d-md-right {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};
export default OrderTracking;
