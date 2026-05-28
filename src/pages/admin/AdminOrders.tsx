import React, { useState, useEffect } from 'react';
import { 
  getAllOrdersAdmin, 
  updateOrderStatus, 
  type Order 
} from '../../services/db';
import { Search, Eye, Printer } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Detail Modal overlay
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Tracking generator inputs
  const [trackingNumber, setTrackingNumber] = useState('');

  const loadOrders = () => {
    setLoading(true);
    setOrders(getAllOrdersAdmin());
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    try {
      updateOrderStatus(orderId, status);
      alert(`ORDER ${orderId} STATUS UPDATED TO ${status.toUpperCase()}`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
    } catch (e: any) {
      alert(`ERROR: ${e.message}`);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      // Direct state update in db orders list
      const allOrders = getAllOrdersAdmin();
      const idx = allOrders.findIndex(o => o.id === selectedOrder.id);
      if (idx !== -1) {
        allOrders[idx].trackingNumber = trackingNumber;
        // Save back to db
        localStorage.setItem('mmi_orders', JSON.stringify(allOrders));
        alert('TRACKING ID UPDATED: Dispatch telemetry confirmed.');
        loadOrders();
        setSelectedOrder(prev => prev ? { ...prev, trackingNumber } : null);
      }
    } catch (err: any) {
      alert('Error updating tracking code: ' + err.message);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const statuses = [
    'All',
    'Pending',
    'Paid',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  // Filtering Logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.shippingAddress.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.shippingAddress.phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontSize: '0.85rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
        LOADING ORDER TELEMETRY...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
      
      {/* HEADER SECTION */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-heading)' }}>ORDER FULFILLMENT</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>Track customer invoices, update dispatch tracking codes, and audit returns.</p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="no-print" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem',
        border: '1px solid var(--admin-border)',
        backgroundColor: 'var(--admin-card-bg)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search Order ID, Phone or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterInputStyle}
          />
          <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
        </div>

        {/* Status filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                fontFamily: 'var(--font-heading)',
                border: '1px solid',
                borderColor: selectedStatus === stat ? 'var(--admin-accent)' : 'var(--admin-border)',
                backgroundColor: selectedStatus === stat ? 'var(--admin-accent)' : 'transparent',
                color: selectedStatus === stat ? '#ffffff' : 'var(--admin-text)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {stat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="no-print" style={{ overflowX: 'auto', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <th style={thStyle}>ORDER ID</th>
              <th style={thStyle}>DATE</th>
              <th style={thStyle}>CUSTOMER CITY</th>
              <th style={thStyle}>PAYMENT METHOD</th>
              <th style={thStyle}>TOTAL VALUE</th>
              <th style={thStyle}>TRACKING ID</th>
              <th style={thStyle}>STATUS</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                  NO ORDER ARCHIVES FOUND.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{o.id}</td>
                  <td style={tdStyle}>{o.date.split(',')[0]}</td>
                  <td style={tdStyle}>{o.shippingAddress.city}</td>
                  <td style={tdStyle}>{o.paymentMethod}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>₹{o.total.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.75rem' }}>{o.trackingNumber || 'UNASSIGNED'}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(o.status)}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button 
                      onClick={() => {
                        setSelectedOrder(o);
                        setTrackingNumber(o.trackingNumber || '');
                      }}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--admin-border)',
                        color: 'var(--admin-accent)',
                        padding: '6px 12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={12} /> AUDIT
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* COMPREHENSIVE AUDIT & INVOICE DETAIL OVERLAY */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} className="modal-container-overlay">
          
          <div style={{
            width: '100%',
            maxWidth: '750px',
            backgroundColor: '#ffffff',
            border: '1px solid #000',
            padding: '2.5rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'modalSlide 0.3s ease',
            color: '#000000'
          }} className="print-area">
            
            {/* Header info - hidden in normal view but displayed in print */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 900, letterSpacing: '0.15em' }}>MADMOOD</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: '#666', lineHeight: '1.4' }}>
                  Unnao, Uttar Pradesh, India - 209801
                  <br />
                  Email: shivendrasahu003@gmail.com
                  <br />
                  Ph: +91 6386376901
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, border: '1px solid #000', padding: '3px 8px', letterSpacing: '0.05em' }}>TAX INVOICE</span>
                <h4 style={{ margin: '10px 0 0 0', fontSize: '0.9rem', fontWeight: 700 }}>{selectedOrder.id}</h4>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>DATE: {selectedOrder.date}</span>
              </div>
            </div>

            {/* Inner Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }} className="no-print">
              {/* Left Column: Customer details */}
              <div>
                <h4 style={subHeadingStyle}>CUSTOMER DIRECTORY DETAILS</h4>
                <p style={detailTextStyle}>
                  <strong>Recipient Name:</strong> {selectedOrder.shippingAddress.label}
                  <br />
                  <strong>Phone Contact:</strong> {selectedOrder.shippingAddress.phone}
                  <br />
                  <strong>Address Coordinates:</strong>
                  <br />
                  {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.locality}
                  <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - <strong>{selectedOrder.shippingAddress.pincode}</strong>
                </p>
              </div>

              {/* Right Column: Order Actions */}
              <div>
                <h4 style={subHeadingStyle}>OPERATION CONTROLS</h4>
                
                {/* Status Switcher */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>CHANGE STATE</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                      style={{ border: '1px solid #000', padding: '6px', fontSize: '0.75rem', flexGrow: 1, outline: 'none', background: '#fff' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Tracking ID Form */}
                <form onSubmit={handleSaveTracking}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>ASSIGN LOGISTICS ID</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="e.g. IN-SFX-2938102"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      style={{ border: '1px solid #000', padding: '6px 10px', fontSize: '0.75rem', flexGrow: 1, outline: 'none' }}
                    />
                    <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                      ASSIGN
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Line Items Table */}
            <h4 style={subHeadingStyle}>APPAREL LINE ITEMS</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000', background: '#f8f9fa' }}>
                  <th style={itemThStyle}>PRODUCT DETAILS</th>
                  <th style={itemThStyle}>SIZE</th>
                  <th style={{ ...itemThStyle, textAlign: 'center' }}>QTY</th>
                  <th style={{ ...itemThStyle, textAlign: 'right' }}>RATE</th>
                  <th style={{ ...itemThStyle, textAlign: 'right' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={itemTdStyle}>
                      <strong>{item.product.name}</strong>
                      <br />
                      <span style={{ fontSize: '0.65rem', color: '#666' }}>SKU: {item.product.id.toUpperCase()}</span>
                    </td>
                    <td style={itemTdStyle}>{item.size}</td>
                    <td style={{ ...itemTdStyle, textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ ...itemTdStyle, textAlign: 'right' }}>₹{item.priceAtPurchase}</td>
                    <td style={{ ...itemTdStyle, textAlign: 'right' }}>₹{item.priceAtPurchase * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Math Breakdowns */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #000', paddingTop: '1rem' }}>
              <div style={{ width: '240px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>LINE ITEM TOTAL:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'red' }}>
                    <span>COUPON DEDUCTION:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>CGST & SGST (18% INCL):</span>
                  <span style={{ color: '#666' }}>₹{selectedOrder.gstAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>LOGISTICS CHARGE:</span>
                  <span>₹{selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #000', paddingTop: '6px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <span>GRAND TOTAL:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Print Overlay Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.25rem' }} className="no-print">
              <button 
                onClick={printInvoice}
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={14} /> PRINT RECEIPT INVOICE
              </button>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: '#fff',
                  border: '1px solid #000',
                  color: '#000',
                  padding: '10px 20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                CLOSE VIEW
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: var(--admin-hover-effect);
        }
        @media print {
          body * {
            visibility: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .modal-container-overlay {
            position: absolute !important;
            background: none !important;
            backdrop-filter: none !important;
          }
        }
      `}</style>

    </div>
  );
};

// Styles
const filterInputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--admin-border)',
  borderRadius: 0,
  padding: '6px 12px',
  fontSize: '0.75rem',
  backgroundColor: 'var(--admin-card-bg)',
  color: 'var(--admin-text)',
  outline: 'none'
};

const thStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  borderBottom: '2px solid var(--admin-border)',
  color: 'var(--admin-text)'
};

const tdStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  borderBottom: '1px solid var(--admin-border)',
  verticalAlign: 'middle',
  color: 'var(--admin-text)'
};

const statusBadgeStyle = (status: Order['status']): React.CSSProperties => {
  let colors = { bg: 'rgba(0,0,0,0.06)', text: 'var(--admin-text)', border: 'var(--admin-border)' };
  
  if (status === 'Delivered') colors = { bg: 'rgba(43, 138, 62, 0.08)', text: 'var(--color-success)', border: 'var(--color-success)' };
  else if (status === 'Cancelled') colors = { bg: 'rgba(255, 29, 64, 0.08)', text: '#ff1d40', border: '#ff1d40' };
  else if (status === 'Shipped') colors = { bg: 'rgba(197, 168, 128, 0.08)', text: 'var(--admin-accent)', border: 'var(--admin-accent)' };
  else if (status === 'Paid') colors = { bg: 'rgba(0, 150, 136, 0.08)', text: '#009688', border: '#009688' };

  return {
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '2px 8px',
    border: '1px solid',
    borderColor: colors.border,
    backgroundColor: colors.bg,
    color: colors.text,
    letterSpacing: '0.04em'
  };
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: '#000000',
  borderBottom: '1px solid #000',
  paddingBottom: '4px',
  marginBottom: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const detailTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  lineHeight: '1.6',
  color: '#333333',
  margin: 0
};

const itemThStyle: React.CSSProperties = {
  padding: '6px',
  fontWeight: 'bold',
  textAlign: 'left'
};

const itemTdStyle: React.CSSProperties = {
  padding: '8px 6px',
  verticalAlign: 'top'
};

export default AdminOrders;
