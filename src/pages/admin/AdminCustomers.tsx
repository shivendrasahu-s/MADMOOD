import React, { useState, useEffect } from 'react';
import { 
  getUsersAdmin, 
  getAllOrdersAdmin, 
  type User, 
  type Order 
} from '../../services/db';
import { Search, Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';

interface CustomerTelemetry extends User {
  orderCount: number;
  totalSpent: number;
  orders: Order[];
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerTelemetry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active modal details
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerTelemetry | null>(null);

  useEffect(() => {
    setLoading(true);
    const users = getUsersAdmin();
    const allOrders = getAllOrdersAdmin();

    // Map customer stats based on transaction history
    const mapped: CustomerTelemetry[] = users.map(user => {
      // Find orders matching this user's email or phone number
      const userOrders = allOrders.filter(o => 
        (o.shippingAddress.phone && o.shippingAddress.phone === user.phone) ||
        (user.email && o.shippingAddress.phone.includes(user.email)) // email/phone fallback
      );

      const totalSpent = userOrders
        .filter(o => o.status === 'Paid' || o.status === 'Delivered')
        .reduce((acc, o) => acc + o.total, 0);

      return {
        ...user,
        orderCount: userOrders.length,
        totalSpent,
        orders: userOrders
      };
    });

    setCustomers(mapped);
    setLoading(false);
  }, []);

  // Filter
  const filteredCustomers = customers.filter(c => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (c.phone && c.phone.includes(searchQuery));
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontSize: '0.85rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
        LOADING CLIENT TELEMETRY...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-heading)' }}>CUSTOMER TELEMETRY</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>View client transaction history, lifetime spend, and profile contacts.</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{
        padding: '1.25rem',
        border: '1px solid var(--admin-border)',
        backgroundColor: 'var(--admin-card-bg)'
      }}>
        <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            placeholder="Search Client Name, Email or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterInputStyle}
          />
          <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
        </div>
      </div>

      {/* CUSTOMERS GRID TABLE */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <th style={thStyle}>CLIENT NAME</th>
              <th style={thStyle}>EMAIL ADDRESS</th>
              <th style={thStyle}>PHONE CONTACT</th>
              <th style={thStyle}>VERIFICATION</th>
              <th style={thStyle}>TOTAL TRANSACTIONS</th>
              <th style={thStyle}>LIFETIME SPEND</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>ARCHIVES</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                  NO CLIENT TELEMETRY RECORDS MATCHED.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {c.firstName.toUpperCase()} {c.lastName.toUpperCase()}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={12} color="var(--admin-accent)" />
                      <span>{c.email}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={12} color="var(--admin-accent)" />
                      <span>{c.phone || 'N/A'}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={verifyBadgeStyle(!!c.isEmailVerified)}>EMAIL: {c.isEmailVerified ? 'YES' : 'NO'}</span>
                      <span style={verifyBadgeStyle(!!c.isPhoneVerified)}>PHONE: {c.isPhoneVerified ? 'YES' : 'NO'}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 'bold' }}>{c.orderCount} orders</td>
                  <td style={{ ...tdStyle, fontWeight: 800, color: 'var(--admin-accent)' }}>₹{c.totalSpent.toLocaleString('en-IN')}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button 
                      onClick={() => setSelectedCustomer(c)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--admin-border)',
                        color: 'var(--admin-text)',
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      VIEW LOGS
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL DRAWER OVERLAY */}
      {selectedCustomer && (
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
        }}>
          <div style={{
            width: '100%',
            maxWidth: '550px',
            backgroundColor: 'var(--admin-card-bg)',
            border: '1px solid var(--admin-border)',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
            animation: 'modalSlide 0.3s ease',
            color: 'var(--admin-text)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0 }}>
                TRANSACTION HISTORY: {selectedCustomer.firstName.toUpperCase()} {selectedCustomer.lastName.toUpperCase()}
              </h3>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--admin-text)', cursor: 'pointer' }}>
                <Search size={16} style={{ display: 'none' }} />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Profile Overview */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              background: 'var(--admin-bg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.75rem'
            }}>
              <div>
                <span style={{ color: 'var(--admin-text-secondary)', display: 'block', fontSize: '0.65rem' }}>EMAIL DIRECTORY</span>
                <strong>{selectedCustomer.email}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--admin-text-secondary)', display: 'block', fontSize: '0.65rem' }}>PHONE DIRECTORY</span>
                <strong>{selectedCustomer.phone || 'N/A'}</strong>
              </div>
              <div style={{ marginTop: '6px' }}>
                <span style={{ color: 'var(--admin-text-secondary)', display: 'block', fontSize: '0.65rem' }}>LIFETIME VALUE</span>
                <strong style={{ color: 'var(--admin-accent)' }}>₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}</strong>
              </div>
              <div style={{ marginTop: '6px' }}>
                <span style={{ color: 'var(--admin-text-secondary)', display: 'block', fontSize: '0.65rem' }}>TOTAL TRANSACTIONS</span>
                <strong>{selectedCustomer.orderCount} Orders</strong>
              </div>
            </div>

            {/* Orders Feed */}
            <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>ORDER HISTORY LOG</h4>
            
            {selectedCustomer.orders.length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>No orders placed under this contact record.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCustomer.orders.map(o => (
                  <div key={o.id} style={{
                    border: '1px solid var(--admin-border)',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShoppingBag size={12} color="var(--admin-accent)" />
                        <strong>{o.id}</strong>
                      </div>
                      <span style={{ color: 'var(--admin-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={10} /> {o.date.split(',')[0]}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 'bold', display: 'block' }}>₹{o.total}</span>
                      <span style={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 'bold', 
                        color: o.status === 'Delivered' ? 'var(--color-success)' : o.status === 'Cancelled' ? '#ff1d40' : 'var(--admin-accent)'
                      }}>{o.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: var(--admin-hover-effect);
        }
        @keyframes modalSlide {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
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

const verifyBadgeStyle = (verified: boolean): React.CSSProperties => ({
  fontSize: '0.55rem',
  fontWeight: 800,
  padding: '2px 6px',
  borderRadius: 0,
  backgroundColor: verified ? 'rgba(43, 138, 62, 0.08)' : 'rgba(255, 29, 64, 0.08)',
  color: verified ? 'var(--color-success)' : '#ff1d40',
  border: '1px solid',
  borderColor: verified ? 'var(--color-success)' : '#ff1d40'
});

export default AdminCustomers;
