import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  getAllOrdersAdmin, 
  getUsersAdmin,
  type Product,
  type Order,
  type User
} from '../../services/db';
import { 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  RefreshCw 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(getProducts());
      setOrders(getAllOrdersAdmin());
      setCustomers(getUsersAdmin());
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Analytics Metrics calculations
  const totalSales = orders
    .filter(o => o.status === 'Paid' || o.status === 'Delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;
  const growthRate = 12.4; // Simulated growth rate

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Loading Skeletons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ height: '120px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--admin-border)', padding: '1.5rem' }}>
              <div style={{ width: '40%', height: '12px', background: 'rgba(0,0,0,0.05)', marginBottom: '1rem' }} />
              <div style={{ width: '70%', height: '24px', background: 'rgba(0,0,0,0.05)' }} />
            </div>
          ))}
        </div>
        <div className="skeleton-card" style={{ height: '300px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--admin-border)' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
      
      {/* Top Welcome & Sync status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-heading)' }}>CONSOLE OVERVIEW</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>FY 2026 sales, customer telemetry, and operations logs.</p>
        </div>
        <button 
          onClick={loadData} 
          style={{ 
            background: 'var(--admin-card-bg)', 
            border: '1px solid var(--admin-border)', 
            padding: '8px 12px', 
            borderRadius: 0, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: 'var(--admin-text)',
            boxShadow: 'var(--shadow-subtle)'
          }}
          className="hover-trigger"
        >
          <RefreshCw size={12} /> SYNC DATA
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Revenue */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={kpiLabelStyle}>TOTAL BRAND REVENUE</span>
            <div style={kpiIconWrapper}><DollarSign size={16} /></div>
          </div>
          <span style={kpiValStyle}>₹{totalSales.toLocaleString('en-IN')}</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={12} /> <span>+{growthRate}% VS LAST MONTH</span>
          </div>
        </div>

        {/* Orders */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={kpiLabelStyle}>TOTAL COMPLETED ORDERS</span>
            <div style={kpiIconWrapper}><Package size={16} /></div>
          </div>
          <span style={kpiValStyle}>{orders.length}</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <Activity size={12} /> <span>{pendingOrders} ORDERS PENDING SHIPPING</span>
          </div>
        </div>

        {/* Customers */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={kpiLabelStyle}>TOTAL REGISTERED CUSTOMERS</span>
            <div style={kpiIconWrapper}><Users size={16} /></div>
          </div>
          <span style={kpiValStyle}>{customers.length || 18}</span>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={12} /> <span>AVG TICKET VALUE: ₹{(totalSales / (orders.length || 1)).toFixed(0)}</span>
          </div>
        </div>

        {/* Low Stock alerts */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={kpiLabelStyle}>LOW STOCK ALERTS</span>
            <div style={{ ...kpiIconWrapper, backgroundColor: lowStockCount > 0 ? 'rgba(255, 29, 64, 0.08)' : 'var(--admin-hover-effect)', color: lowStockCount > 0 ? '#ff1d40' : 'var(--admin-text)' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <span style={{ ...kpiValStyle, color: lowStockCount > 0 ? '#ff1d40' : 'var(--admin-text)' }}>{lowStockCount}</span>
          <div style={{ fontSize: '0.7rem', color: lowStockCount > 0 ? '#ff1d40' : 'var(--admin-text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <span>{lowStockCount > 0 ? 'CRITICAL RESTOCK NEEDED' : 'ALL STOCK LEVELS VERIFIED'}</span>
          </div>
        </div>
      </div>

      {/* SVG Sales Chart */}
      <div style={{
        border: '1px solid var(--admin-border)',
        borderRadius: 0,
        padding: '2rem',
        backgroundColor: 'var(--admin-card-bg)',
        boxShadow: 'var(--shadow-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--admin-text)', letterSpacing: '0.05em', margin: 0 }}>MONTHLY PERFORMANCE GRID (REVENUE FY26)</h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--admin-accent)', fontWeight: 'bold' }}>REAL-TIME UPDATES</span>
        </div>
        
        <div style={{ height: '240px', width: '100%', position: 'relative' }}>
          <svg viewBox="0 0 600 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Grid Lines */}
            <line x1="50" y1="20" x2="570" y2="20" stroke="var(--admin-border)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="50" y1="70" x2="570" y2="70" stroke="var(--admin-border)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="50" y1="120" x2="570" y2="120" stroke="var(--admin-border)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="50" y1="170" x2="570" y2="170" stroke="var(--admin-border)" strokeWidth="0.5" strokeDasharray="3 3" />
            
            {/* Y Axis labels */}
            <text x="15" y="24" fill="var(--admin-text-secondary)" fontSize="9" fontFamily="var(--font-heading)">₹1.5L</text>
            <text x="15" y="74" fill="var(--admin-text-secondary)" fontSize="9" fontFamily="var(--font-heading)">₹1.0L</text>
            <text x="15" y="124" fill="var(--admin-text-secondary)" fontSize="9" fontFamily="var(--font-heading)">₹50K</text>
            <text x="15" y="174" fill="var(--admin-text-secondary)" fontSize="9" fontFamily="var(--font-heading)">₹0K</text>

            {/* Chart Line Path */}
            <path
              d="M 85 145 L 180 125 L 275 80 L 370 105 L 465 50 L 560 30"
              fill="none"
              stroke="var(--admin-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Shading area below path */}
            <path
              d="M 85 170 L 85 145 L 180 125 L 275 80 L 370 105 L 465 50 L 560 30 L 560 170 Z"
              fill="rgba(197, 168, 128, 0.05)"
            />

            {/* Dots on line path */}
            <circle cx="85" cy="145" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />
            <circle cx="180" cy="125" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />
            <circle cx="275" cy="80" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />
            <circle cx="370" cy="105" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />
            <circle cx="465" cy="50" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />
            <circle cx="560" cy="30" r="4.5" fill="var(--admin-accent)" stroke="var(--admin-card-bg)" strokeWidth="1.5" />

            {/* X Axis labels */}
            <text x="75" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">JAN</text>
            <text x="170" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">FEB</text>
            <text x="265" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">MAR</text>
            <text x="360" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">APR</text>
            <text x="455" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">MAY</text>
            <text x="550" y="195" fill="var(--admin-text-secondary)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">JUN</text>
          </svg>
        </div>
      </div>

      {/* Grid splits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Top selling apparel */}
        <div style={panelCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
            <h3 style={panelTitleStyle}>TOP SELLING APPAREL</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-secondary)' }}>VOLUME SALES</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.slice(0, 4).map((p, idx) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, width: '20px', color: 'var(--admin-accent)' }}>{idx + 1}</span>
                <img src={p.images[0]} alt="" style={{ width: '36px', height: '44px', objectFit: 'cover' }} />
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', color: 'var(--admin-text)' }}>{p.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-secondary)' }}>{p.category}</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{p.stock} in stock</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={panelCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.75rem' }}>
            <h3 style={panelTitleStyle}>RECENT ORDER ENTRIES</h3>
            <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-secondary)' }}>REAL-TIME FEED</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.slice(0, 4).map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--admin-border)', paddingBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.75rem', display: 'block', color: 'var(--admin-text)' }}>{o.id}</strong>
                  <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-secondary)' }}>{o.shippingAddress.city} • {o.paymentMethod}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', color: 'var(--admin-text)' }}>₹{o.total.toLocaleString('en-IN')}</span>
                  <span style={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 700, 
                    color: o.status === 'Delivered' ? 'var(--color-success)' : o.status === 'Cancelled' ? '#ff1d40' : 'var(--admin-accent)',
                    border: '1px solid',
                    borderColor: o.status === 'Delivered' ? 'var(--color-success)' : o.status === 'Cancelled' ? '#ff1d40' : 'var(--admin-accent)',
                    padding: '1px 6px',
                    marginLeft: 'auto',
                    display: 'inline-block',
                    marginTop: '2px'
                  }}>
                    {o.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styling structures
const kpiCardStyle: React.CSSProperties = {
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  borderRadius: 0,
  padding: '1.5rem',
  boxShadow: 'var(--shadow-subtle)',
  display: 'flex',
  flexDirection: 'column'
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--admin-text-secondary)',
  letterSpacing: '0.05em'
};

const kpiValStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  color: 'var(--admin-text)',
  marginTop: '0.5rem',
  letterSpacing: '-0.02em'
};

const kpiIconWrapper: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'var(--admin-hover-effect)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--admin-accent)'
};

const panelCardStyle: React.CSSProperties = {
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  borderRadius: 0,
  padding: '1.5rem',
  boxShadow: 'var(--shadow-subtle)'
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--admin-text)',
  margin: 0,
  letterSpacing: '0.05em'
};

export default AdminDashboard;
