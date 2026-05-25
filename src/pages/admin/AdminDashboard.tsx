import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getProducts, 
  getAllOrdersAdmin, 
  getUsersAdmin, 
  getPopupSettings, 
  getBannersSettings, 
  addProductAdmin, 
  updateProductAdmin, 
  deleteProductAdmin, 
  updateOrderStatus, 
  cancelOrder, 
  savePopupSettings, 
  saveBannersSettings,
  type Product,
  type Order,
  type User,
  type PopupSettings,
  type BannerSlide
} from '../../services/db';
import { isFirebaseEnabled } from '../../services/firebase';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Users, 
  SlidersHorizontal, 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  TrendingUp, 
  LogOut, 
  AlertTriangle, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Tag, 
  RefreshCw 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'overview' | 'products' | 'orders' | 'customers' | 'homepage' | 'popup' | 'inventory'>('overview');

  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [popupSettings, setPopupSettings] = useState<PopupSettings | null>(null);
  const [banners, setBanners] = useState<BannerSlide[]>([]);

  // Product Form Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form Fields
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState(1499);
  const [pMrp, setPMrp] = useState(2999);
  const [pCategory, setPCategory] = useState<Product['category']>('Polo T-Shirts');
  const [pSizes, setPSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [pStock, setPStock] = useState(30);
  const [pImages, setPImages] = useState<string[]>(['', '']);
  const [pDetails, setPDetails] = useState<string[]>(['100% Cotton', 'Classic fit']);
  const [pIsBestSeller, setPIsBestSeller] = useState(false);
  const [pIsNewRelease, setPIsNewRelease] = useState(true);
  const [pColors, setPColors] = useState('');

  // Active Selected Invoice Overlay
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Security check on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('mmi_admin_authenticated');
    if (adminSession !== 'true') {
      navigate('/admin');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = () => {
    setProducts(getProducts());
    setOrders(getAllOrdersAdmin());
    setCustomers(getUsersAdmin());
    setPopupSettings(getPopupSettings());
    setBanners(getBannersSettings());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mmi_admin_authenticated');
    navigate('/admin');
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPId('ind-' + Math.floor(100 + Math.random() * 900));
    setPName('');
    setPDescription('');
    setPPrice(1499);
    setPMrp(2999);
    setPCategory('Polo T-Shirts');
    setPSizes(['S', 'M', 'L', 'XL']);
    setPStock(30);
    setPImages(['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800', '']);
    setPDetails(['100% Premium Combed Cotton', 'Contrast tipped detail', 'Regular fit']);
    setPIsBestSeller(false);
    setPIsNewRelease(true);
    setPColors('Classic Black, Off-White');
    setShowProductModal(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setPId(product.id);
    setPName(product.name);
    setPDescription(product.description);
    setPPrice(product.price);
    setPMrp(product.mrp);
    setPCategory(product.category);
    setPSizes(product.sizes);
    setPStock(product.stock);
    setPImages(product.images.length > 0 ? [...product.images] : ['', '']);
    setPDetails(product.details.length > 0 ? [...product.details] : ['']);
    setPIsBestSeller(!!product.isBestSeller);
    setPIsNewRelease(!!product.isNewRelease);
    setPColors(product.colors ? product.colors.join(', ') : '');
    setShowProductModal(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pDescription.trim()) {
      alert('REQUIRED FIELDS: Enter name and description.');
      return;
    }

    const cleanedImages = pImages.filter(img => img.trim() !== '');
    if (cleanedImages.length === 0) {
      cleanedImages.push('https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800');
    }

    const payload: Product = {
      id: pId,
      name: pName.toUpperCase(),
      description: pDescription,
      price: Number(pPrice),
      mrp: Number(pMrp),
      category: pCategory,
      sizes: pSizes,
      stock: Number(pStock),
      images: cleanedImages,
      reviews: editingProduct ? editingProduct.reviews : [],
      details: pDetails.filter(d => d.trim() !== ''),
      isBestSeller: pIsBestSeller,
      isNewRelease: pIsNewRelease,
      colors: pColors.split(',').map(c => c.trim()).filter(c => c !== '')
    };

    if (editingProduct) {
      updateProductAdmin(payload);
      alert('PRODUCT DATA COMMITTED TO CLOUD');
    } else {
      addProductAdmin(payload);
      alert('NEW PRODUCT DATA RECORDED');
    }
    setShowProductModal(false);
    loadData();
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('CONFIRM DELETE: Do you want to remove this product permanently?')) {
      deleteProductAdmin(id);
      loadData();
      alert('PRODUCT DELETED');
    }
  };

  const handleSizeToggle = (size: string) => {
    setPSizes((prev) => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // --- HOME SLIDER ACTION CONTROLLERS ---
  const handleBannerChange = (index: number, field: keyof BannerSlide, value: string) => {
    const updated = [...banners];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setBanners(updated);
  };

  const handleSaveBanners = () => {
    saveBannersSettings(banners);
    alert('HOMEPAGE HERO SLIDES UPDATED IN DATABASE');
  };

  // --- POPUP ACTION CONTROLLERS ---
  const handlePopupToggle = (active: boolean) => {
    if (popupSettings) {
      const updated = { ...popupSettings, isActive: active };
      setPopupSettings(updated);
      savePopupSettings(updated);
    }
  };

  const handlePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (popupSettings) {
      savePopupSettings(popupSettings);
      alert('POPUP SETTINGS SAVED');
    }
  };

  // --- INVENTORY BULK UPDATE ---
  const handleInventoryStockAdjust = (id: string, amount: number) => {
    const target = products.find(p => p.id === id);
    if (target) {
      const updated = {
        ...target,
        stock: Math.max(0, target.stock + amount)
      };
      updateProductAdmin(updated);
      loadData();
    }
  };

  const handlePrintSelectedInvoice = () => {
    window.print();
  };

  // Analytics Metrics calculations
  const totalSales = orders
    .filter(o => o.status === 'Paid' || o.status === 'Delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-white)',
      fontFamily: 'var(--font-body)',
      color: '#000000'
    }}>
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="no-print" style={{
        width: '260px',
        borderRight: '1px solid var(--color-gray-border)',
        backgroundColor: 'var(--bg-gray-light)',
        padding: '2.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        flexShrink: 0
      }}>
        <div>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '0.15em', display: 'block', marginBottom: '4px' }}>ADMIN CONSOLE</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.08em', margin: 0 }}>
            MAD<span style={{ color: 'var(--color-primary)' }}>MOOD</span>
          </h2>
          <div style={{ marginTop: '1rem', padding: '10px', background: 'rgba(0,0,0,0.03)', borderLeft: '2px solid var(--color-primary)', fontSize: '0.7rem', color: 'var(--color-gray-text)', fontFamily: 'var(--font-header)' }}>
            <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#000' }}>POWERED BY //</p>
            <p style={{ margin: '0 0 2px 0' }}>Pushpendra Sahu</p>
            <p style={{ margin: '0 0 2px 0' }}>Shivendra Sahu</p>
            <p style={{ margin: '0 0 6px 0' }}>Dipendra Sahu</p>
            <p style={{ margin: '0 0 2px 0', color: 'var(--color-primary)' }}>HQ: Unnao, UP, India</p>
            <p style={{ margin: 0 }}>Ph: +91 6386376901</p>
          </div>
        </div>

        {/* Sidebar Navigation Link items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <button 
            onClick={() => setActiveModule('overview')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'overview' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'overview' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          
          <button 
            onClick={() => setActiveModule('products')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'products' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'products' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <ShoppingBag size={16} /> Products ({products.length})
          </button>

          <button 
            onClick={() => setActiveModule('orders')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'orders' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'orders' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <Package size={16} /> Orders ({orders.length})
          </button>

          <button 
            onClick={() => setActiveModule('customers')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'customers' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'customers' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <Users size={16} /> Customers ({customers.length})
          </button>

          <button 
            onClick={() => setActiveModule('homepage')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'homepage' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'homepage' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <SlidersHorizontal size={16} /> Hero Sliders
          </button>

          <button 
            onClick={() => setActiveModule('popup')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'popup' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'popup' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <Tag size={16} /> Marketing Popups
          </button>

          <button 
            onClick={() => setActiveModule('inventory')} 
            style={{ ...sidebarBtnStyle, backgroundColor: activeModule === 'inventory' ? 'var(--color-primary)' : 'transparent', color: activeModule === 'inventory' ? '#fff' : 'var(--color-gray-text)' }}
          >
            <AlertTriangle size={16} /> Inventory alerts {lowStockCount > 0 && <span style={{ background: '#ff1d40', color: '#fff', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '10px', marginLeft: 'auto', fontWeight: 800 }}>{lowStockCount}</span>}
          </button>
        </nav>

        {/* Action button */}
        <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.5rem' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-gray-text)', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              padding: '8px'
            }}
          >
            <LogOut size={16} /> Disconnect portal
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN PORTAL CONTENT */}
      <main style={{
        flexGrow: 1,
        padding: '2.5rem 3.5rem',
        overflowY: 'auto',
        backgroundColor: '#ffffff'
      }} className="main-viewport-admin">
        
        {/* Top Header */}
        <header className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          borderBottom: '1px solid var(--color-gray-border)',
          paddingBottom: '1.25rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
              {activeModule === 'overview' && 'SYSTEM OVERVIEW'}
              {activeModule === 'products' && 'PRODUCT DIRECTORY'}
              {activeModule === 'orders' && 'ORDER FULFILLMENT'}
              {activeModule === 'customers' && 'CUSTOMER TELEMETRY'}
              {activeModule === 'homepage' && 'HOMEPAGE CUSTOMIZER'}
              {activeModule === 'popup' && 'PROMO POPUP MANAGER'}
              {activeModule === 'inventory' && 'INVENTORY & ALERT METRICS'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={loadData} title="Reload Data" style={{ background: '#ffffff', border: '1px solid var(--color-gray-border)', padding: '8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--color-gray-text)' }}>
              <RefreshCw size={14} />
            </button>
            {isFirebaseEnabled ? (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: 'rgba(43, 138, 62, 0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> LIVE CLOUD DB
              </span>
            ) : (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: 'rgba(255, 169, 0, 0.1)', color: '#b57700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> OFFLINE SIMULATION
              </span>
            )}
            
            <Link to="/" target="_blank" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'underline' }}>
              View Storefront
            </Link>
          </div>
        </header>

        {/* MODULE ROUTER VIEWS */}

        {/* 2.A OVERVIEW / ANALYTICS */}
        {activeModule === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="no-print">
            {/* KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={kpiCardStyle}>
                <span style={kpiLabelStyle}>TOTAL BRAND REVENUE</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={kpiValStyle}>₹{totalSales.toLocaleString('en-IN')}</span>
                  <DollarSign size={20} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px' }}>
                  <TrendingUp size={10} /> +12.4% vs last month
                </span>
              </div>

              <div style={kpiCardStyle}>
                <span style={kpiLabelStyle}>TOTAL ORDERS PLACED</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={kpiValStyle}>{orders.length}</span>
                  <Package size={20} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', fontWeight: 600, display: 'block', marginTop: '6px' }}>
                  Active pending: <strong>{pendingOrders} orders</strong>
                </span>
              </div>

              <div style={kpiCardStyle}>
                <span style={kpiLabelStyle}>CUSTOMER PORTALS</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={kpiValStyle}>{customers.length || 12}</span>
                  <Users size={20} color="var(--color-primary)" />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-success)', fontWeight: 600, display: 'block', marginTop: '6px' }}>
                  Avg. Ticket Value: <strong>₹{(totalSales / (orders.length || 1)).toFixed(0)}</strong>
                </span>
              </div>

              <div style={kpiCardStyle}>
                <span style={kpiLabelStyle}>LOW STOCK ALERTS</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ ...kpiValStyle, color: lowStockCount > 0 ? '#ff1d40' : 'var(--color-primary)' }}>{lowStockCount}</span>
                  <AlertTriangle size={20} color={lowStockCount > 0 ? '#ff1d40' : 'var(--color-primary)'} />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-gray-text)', fontWeight: 600, display: 'block', marginTop: '6px' }}>
                  Requires urgent restock
                </span>
              </div>
            </div>

            {/* Sales Chart drawn dynamically with SVG (No dependencies, ultra-premium responsive rendering) */}
            <div style={{
              border: '1px solid var(--color-gray-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>MONTHLY REVENUE GRID (FY26)</h3>
              
              <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                <svg viewBox="0 0 600 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="570" y2="20" stroke="#f1f3f5" strokeWidth="1" />
                  <line x1="50" y1="70" x2="570" y2="70" stroke="#f1f3f5" strokeWidth="1" />
                  <line x1="50" y1="120" x2="570" y2="120" stroke="#f1f3f5" strokeWidth="1" />
                  <line x1="50" y1="170" x2="570" y2="170" stroke="#f1f3f5" strokeWidth="1" />
                  
                  {/* Y Axis labels */}
                  <text x="15" y="24" fill="var(--color-gray-text)" fontSize="9" fontFamily="var(--font-heading)">₹1.5L</text>
                  <text x="15" y="74" fill="var(--color-gray-text)" fontSize="9" fontFamily="var(--font-heading)">₹1.0L</text>
                  <text x="15" y="124" fill="var(--color-gray-text)" fontSize="9" fontFamily="var(--font-heading)">₹50K</text>
                  <text x="15" y="174" fill="var(--color-gray-text)" fontSize="9" fontFamily="var(--font-heading)">₹0K</text>

                  {/* Chart Line Path */}
                  {/* Jan: 25K (145y), Feb: 45K (125y), Mar: 90K (80y), Apr: 65K (105y), May: 120K (50y), Jun: 140K (30y) */}
                  <path
                    d="M 85 145 L 180 125 L 275 80 L 370 105 L 465 50 L 560 30"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Shading area below path */}
                  <path
                    d="M 85 170 L 85 145 L 180 125 L 275 80 L 370 105 L 465 50 L 560 30 L 560 170 Z"
                    fill="rgba(10, 29, 55, 0.04)"
                  />

                  {/* Dots on line path */}
                  <circle cx="85" cy="145" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="180" cy="125" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="275" cy="80" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="370" cy="105" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="465" cy="50" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="560" cy="30" r="4.5" fill="var(--color-primary)" stroke="#fff" strokeWidth="1.5" />

                  {/* X Axis labels */}
                  <text x="75" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">JAN</text>
                  <text x="170" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">FEB</text>
                  <text x="265" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">MAR</text>
                  <text x="360" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">APR</text>
                  <text x="455" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">MAY</text>
                  <text x="550" y="195" fill="var(--color-gray-text)" fontSize="10" fontWeight="600" fontFamily="var(--font-heading)">JUN</text>
                </svg>
              </div>
            </div>

            {/* Bottom Section: Top Selling Items and Recent orders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Top Products */}
              <div style={panelCardStyle}>
                <h3 style={panelTitleStyle}>TOP SELLING APPAREL</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.slice(0, 3).map((p, idx) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, width: '20px', color: 'var(--color-gray-text)' }}>{idx + 1}</span>
                      <img src={p.images[0]} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flexGrow: 1 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>{p.category}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{p.stock} in stock</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders log */}
              <div style={panelCardStyle}>
                <h3 style={panelTitleStyle}>RECENT ORDER ENTRIES</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.slice(0, 3).map(o => (
                    <div key={o.id} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.8rem', display: 'block' }}>{o.id}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>{o.shippingAddress.city} - {o.paymentMethod}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>₹{o.total.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-primary)' }}>{o.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2.B PRODUCT DIRECTORY */}
        {activeModule === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="no-print">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={openAddProductModal} className="btn-accent-m" style={{ borderRadius: '4px', padding: '0.6rem 1.25rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={14} /> ADD NEW PRODUCT
              </button>
            </div>

            {/* Products catalog list table */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-gray-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
                    <th style={thStyle}>SKU ID</th>
                    <th style={thStyle}>PRODUCT IMAGE</th>
                    <th style={thStyle}>PRODUCT NAME</th>
                    <th style={thStyle}>CATEGORY</th>
                    <th style={thStyle}>PRICE (MRP)</th>
                    <th style={thStyle}>STOCK</th>
                    <th style={thStyle}>MARKETING BADGES</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                      <td style={tdStyle}><strong>{p.id}</strong></td>
                      <td style={tdStyle}>
                        <img src={p.images[0]} alt="" style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-gray-border)' }} />
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 700, display: 'block', color: 'var(--color-black)' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '240px' }}>{p.description}</span>
                      </td>
                      <td style={tdStyle}>{p.category}</td>
                      <td style={tdStyle}>
                        <strong style={{ color: 'var(--color-primary)' }}>₹{p.price.toLocaleString('en-IN')}</strong> 
                        <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--color-gray-text)', marginLeft: '4px' }}>₹{p.mrp.toLocaleString('en-IN')}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 700, color: p.stock < 10 ? '#ff1d40' : 'var(--color-black)' }}>{p.stock} units</span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {p.isBestSeller && <span style={productTagStyle}>Bestseller</span>}
                          {p.isNewRelease && <span style={productTagStyle}>New</span>}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openEditProductModal(p)} style={actionBtnStyle} title="Edit Product"><Edit size={14} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ ...actionBtnStyle, color: '#ff1d40' }} title="Delete Product"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2.C ORDER FULFILLMENT */}
        {activeModule === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="no-print">
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-lg)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-gray-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
                    <th style={thStyle}>ORDER ID</th>
                    <th style={thStyle}>DATE</th>
                    <th style={thStyle}>CUSTOMER</th>
                    <th style={thStyle}>CITY</th>
                    <th style={thStyle}>ITEMS (QTY)</th>
                    <th style={thStyle}>TOTAL AMOUNT</th>
                    <th style={thStyle}>PAYMENT METHOD</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                      <td style={tdStyle}><strong>{o.id}</strong></td>
                      <td style={tdStyle}>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 700, display: 'block' }}>{o.shippingAddress.label.toUpperCase()}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>{o.shippingAddress.phone}</span>
                      </td>
                      <td style={tdStyle}>{o.shippingAddress.city}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {o.items.map((item, idx) => (
                            <img key={idx} src={item.product.images[0]} alt="" style={{ width: '24px', height: '30px', objectFit: 'cover', borderRadius: '2px' }} title={`${item.product.name} x${item.quantity}`} />
                          ))}
                        </div>
                      </td>
                      <td style={tdStyle}><strong>₹{o.total.toLocaleString('en-IN')}</strong></td>
                      <td style={tdStyle}><span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>{o.paymentMethod}</span></td>
                      <td style={tdStyle}>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--color-gray-border)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px',
                            borderRadius: '4px',
                            color: o.status === 'Delivered' || o.status === 'Paid' ? 'var(--color-success)' : 
                                   o.status === 'Failed' || o.status === 'Cancelled' ? '#ff1d40' : 
                                   'var(--color-primary)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => setSelectedInvoiceOrder(o)} style={actionBtnStyle} title="View / Print Tax Invoice"><FileText size={14} /></button>
                          {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                            <button onClick={() => { if(window.confirm('Cancel order?')) cancelOrder(o.id); loadData(); }} style={{ ...actionBtnStyle, color: '#ff1d40' }} title="Cancel Order"><X size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2.D CUSTOMER TELEMETRY */}
        {activeModule === 'customers' && (
          <div style={{ overflowX: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 'var(--radius-lg)' }} className="no-print">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-gray-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
                  <th style={thStyle}>CUSTOMER NAME</th>
                  <th style={thStyle}>EMAIL CONNECTION</th>
                  <th style={thStyle}>ADDRESSES</th>
                  <th style={thStyle}>WISHLIST COUNT</th>
                  <th style={thStyle}>COMPLETED ORDERS</th>
                  <th style={thStyle}>TOTAL SPENT</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, idx) => {
                  const customerOrders = orders.filter(o => o.shippingAddress.phone.includes(c.email) || o.shippingAddress.phone === c.addresses[0]?.phone);
                  const totalSpent = customerOrders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total, 0);

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                      <td style={tdStyle}><strong>{c.firstName} {c.lastName}</strong></td>
                      <td style={tdStyle}>{c.email}</td>
                      <td style={tdStyle}>
                        {c.addresses && c.addresses.length > 0 ? (
                          <span>{c.addresses[0].streetAddress}, {c.addresses[0].city} ({c.addresses.length} saved)</span>
                        ) : (
                          <span style={{ color: 'var(--color-gray-text)' }}>No addresses saved</span>
                        )}
                      </td>
                      <td style={tdStyle}>{c.wishlist?.length || 0} items</td>
                      <td style={tdStyle}>{customerOrders.length} orders</td>
                      <td style={tdStyle}><strong>₹{totalSpent.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 2.E HERO SLIDERS CUSTOMIZER */}
        {activeModule === 'homepage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="no-print">
            <div style={panelCardStyle}>
              <h3 style={panelTitleStyle}>HOMEPAGE HERO SLIDES CONFIG</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {banners.map((slide, idx) => (
                  <div key={idx} style={{
                    border: '1px solid var(--color-gray-border)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-gray-light)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.25rem'
                  }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>HERO SLIDE #{idx + 1}</strong>
                    </div>

                    <div>
                      <label style={labelStyle}>SLIDE MAIN TITLE</label>
                      <input type="text" value={slide.title} onChange={(e) => handleBannerChange(idx, 'title', e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>SLIDE SUBTITLE</label>
                      <input type="text" value={slide.subtitle} onChange={(e) => handleBannerChange(idx, 'subtitle', e.target.value)} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>SLIDE DESCRIPTION</label>
                      <textarea value={slide.description} onChange={(e) => handleBannerChange(idx, 'description', e.target.value)} style={{ ...inputStyle, resize: 'none' }} rows={2} />
                    </div>

                    <div>
                      <label style={labelStyle}>IMAGE URL (UNSPLASH OR CLOUD SOURCE)</label>
                      <input type="text" value={slide.image} onChange={(e) => handleBannerChange(idx, 'image', e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>CTA SHOPPING LINK</label>
                      <input type="text" value={slide.link} onChange={(e) => handleBannerChange(idx, 'link', e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button onClick={handleSaveBanners} className="btn-accent-m" style={{ borderRadius: '4px' }}>
                  SAVE SLIDER CONFIG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2.F PROMO POPUP MANAGER */}
        {activeModule === 'popup' && popupSettings && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="no-print">
            <div style={panelCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ ...panelTitleStyle, margin: 0 }}>PROMOTIONAL SUBSCRIBER POPUP</h3>
                
                {/* Active Toggle Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: popupSettings.isActive ? 'var(--color-success)' : 'var(--color-gray-text)' }}>
                    {popupSettings.isActive ? 'POPUP SYSTEM ACTIVE' : 'POPUP SYSTEM DISABLED'}
                  </span>
                  <input
                    type="checkbox"
                    checked={popupSettings.isActive}
                    onChange={(e) => handlePopupToggle(e.target.checked)}
                    style={{ width: '36px', height: '20px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <form onSubmit={handlePopupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>POPUP MODAL TITLE</label>
                    <input
                      type="text"
                      value={popupSettings.title}
                      onChange={(e) => setPopupSettings({ ...popupSettings, title: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>POPUP OFFER PROMO CODE</label>
                    <input
                      type="text"
                      value={popupSettings.promoCode}
                      onChange={(e) => setPopupSettings({ ...popupSettings, promoCode: e.target.value })}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>POPUP DESCRIPTION TEXT</label>
                  <textarea
                    value={popupSettings.text}
                    onChange={(e) => setPopupSettings({ ...popupSettings, text: e.target.value })}
                    style={{ ...inputStyle, resize: 'none' }}
                    rows={3}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>DISPLAY TIMING DELAY (IN SECONDS)</label>
                    <input
                      type="number"
                      value={popupSettings.delay}
                      onChange={(e) => setPopupSettings({ ...popupSettings, delay: Number(e.target.value) })}
                      style={inputStyle}
                      min={1}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>POPUP BANNER IMAGE URL (OPTIONAL SPLIT-PANE)</label>
                    <input
                      type="text"
                      value={popupSettings.image}
                      onChange={(e) => setPopupSettings({ ...popupSettings, image: e.target.value })}
                      style={inputStyle}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn-accent-m" style={{ borderRadius: '4px' }}>
                    SAVE POPUP SETTINGS
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2.G INVENTORY & ALERTS */}
        {activeModule === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="no-print">
            {/* Low stock alerts panel */}
            <div style={{ ...panelCardStyle, border: '1px solid #ff1d40', background: 'rgba(255, 29, 64, 0.02)' }}>
              <h3 style={{ ...panelTitleStyle, color: '#ff1d40', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={18} /> LOW STOCK WARNING ALARMS (&lt; 10 units)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {products.filter(p => p.stock < 10).length === 0 ? (
                  <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> ALL STOCKS ABOVE SECURITY COEFFICIENT threshold levels.
                  </p>
                ) : (
                  products.filter(p => p.stock < 10).map(p => (
                    <div key={p.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '1rem',
                      background: '#ffffff',
                      border: '1.5px solid #ff1d40',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-subtle)'
                    }}>
                      <img src={p.images[0]} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flexGrow: 1 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000', display: 'block' }}>{p.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#ff1d40', fontWeight: 600 }}>CURRENT STOCK: {p.stock} UNITS REMAINING</span>
                      </div>
                      
                      {/* Fast adjustment buttons */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button onClick={() => handleInventoryStockAdjust(p.id, 10)} style={{ ...invAdjustBtnStyle, backgroundColor: 'rgba(10, 29, 55, 0.08)' }}>+10 units</button>
                        <button onClick={() => handleInventoryStockAdjust(p.id, 50)} style={{ ...invAdjustBtnStyle, backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>+50 units</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* General Inventory table */}
            <div style={panelCardStyle}>
              <h3 style={panelTitleStyle}>COMPLETE WAREHOUSE STOCK LOG</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--color-gray-border)', paddingBottom: '8px' }}>
                      <th style={{ padding: '8px 0', color: 'var(--color-primary)' }}>PRODUCT ID</th>
                      <th style={{ padding: '8px 0', color: 'var(--color-primary)' }}>NAME</th>
                      <th style={{ padding: '8px 0', color: 'var(--color-primary)' }}>CATEGORY</th>
                      <th style={{ padding: '8px 0', color: 'var(--color-primary)', textAlign: 'center' }}>STOCK COUNTS</th>
                      <th style={{ padding: '8px 0', color: 'var(--color-primary)', textAlign: 'center' }}>QUICK RESTOCK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                        <td style={{ padding: '12px 0' }}><strong>{p.id}</strong></td>
                        <td style={{ padding: '12px 0' }}>{p.name}</td>
                        <td style={{ padding: '12px 0' }}>{p.category}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>
                          <span style={{ 
                            fontWeight: 700, 
                            color: p.stock < 10 ? '#ff1d40' : 'var(--color-black)',
                            background: p.stock < 10 ? 'rgba(255,29,64,0.08)' : 'transparent',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>{p.stock} units</span>
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '4px' }}>
                            <button onClick={() => handleInventoryStockAdjust(p.id, 5)} style={invActionBtnStyle}>+5</button>
                            <button onClick={() => handleInventoryStockAdjust(p.id, 20)} style={invActionBtnStyle}>+20</button>
                            <button onClick={() => handleInventoryStockAdjust(p.id, -5)} style={{ ...invActionBtnStyle, color: '#ff1d40' }}>-5</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. DYNAMIC PRODUCT FORM MODAL */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          animation: 'fadeIn 0.3s ease-out'
        }} className="no-print">
          <div style={{
            background: '#ffffff',
            maxWidth: '650px',
            width: '90%',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-primary)',
            boxShadow: 'var(--shadow-hover)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button onClick={() => setShowProductModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--color-black)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '8px', color: 'var(--color-primary)' }}>
              {editingProduct ? `EDIT PRODUCT SKU: ${pId}` : 'ADD NEW PRODUCT ENTRY'}
            </h3>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>PRODUCT NAME</label>
                  <input type="text" value={pName} onChange={(e) => setPName(e.target.value)} style={inputStyle} placeholder="CLASSIC OXFORD SHIRT" required />
                </div>
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select value={pCategory} onChange={(e) => setPCategory(e.target.value as any)} style={inputStyle} required>
                    <option value="Oversized T-Shirts">Oversized T-Shirts</option>
                    <option value="Polo T-Shirts">Polo T-Shirts</option>
                    <option value="Premium Shirts">Premium Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Sweatshirts">Sweatshirts</option>
                    <option value="Cargo Pants">Cargo Pants</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Summer Wear">Summer Wear</option>
                    <option value="Formal Wear">Formal Wear</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea value={pDescription} onChange={(e) => setPDescription(e.target.value)} style={{ ...inputStyle, resize: 'none' }} rows={2} placeholder="Crafted with slub-linen blends..." required />
              </div>

              <div>
                <label style={labelStyle}>COLOR VARIANTS (COMMA SEPARATED)</label>
                <input type="text" value={pColors} onChange={(e) => setPColors(e.target.value)} style={inputStyle} placeholder="e.g. Sage Green, Oatmeal Beige" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>DISCOUNT SELLING PRICE (₹)</label>
                  <input type="number" value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>MAXIMUM RETAIL PRICE MRP (₹)</label>
                  <input type="number" value={pMrp} onChange={(e) => setPMrp(Number(e.target.value))} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>STOCK QUANTITY (UNITS)</label>
                  <input type="number" value={pStock} onChange={(e) => setPStock(Number(e.target.value))} style={inputStyle} required />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label style={labelStyle}>AVAILABLE FIT SIZES</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['S', 'M', 'L', 'XL', '7', '8', '9', '10', '30', '32', '34', '36'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        background: pSizes.includes(size) ? 'var(--color-primary)' : 'transparent',
                        color: pSizes.includes(size) ? '#ffffff' : 'var(--color-black)',
                        border: '1px solid',
                        borderColor: pSizes.includes(size) ? 'var(--color-primary)' : 'var(--color-gray-border)',
                        fontSize: '0.75rem',
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images URLs inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>PRIMARY IMAGE URL</label>
                  <input type="text" value={pImages[0]} onChange={(e) => { const updated = [...pImages]; updated[0] = e.target.value; setPImages(updated); }} style={inputStyle} placeholder="https://images.unsplash.com/..." required />
                </div>
                <div>
                  <label style={labelStyle}>SECONDARY IMAGE URL (HOVER EFFECT)</label>
                  <input type="text" value={pImages[1]} onChange={(e) => { const updated = [...pImages]; updated[1] = e.target.value; setPImages(updated); }} style={inputStyle} placeholder="https://images.unsplash.com/..." />
                </div>
              </div>

              {/* Badges toggles */}
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={pIsBestSeller} onChange={(e) => setPIsBestSeller(e.target.checked)} style={{ cursor: 'pointer' }} id="cbBest" />
                  <label htmlFor="cbBest" style={{ fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>MARK BESTSELLER BADGE</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={pIsNewRelease} onChange={(e) => setPIsNewRelease(e.target.checked)} style={{ cursor: 'pointer' }} id="cbNew" />
                  <label htmlFor="cbNew" style={{ fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>MARK NEW ARRIVALS BADGE</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="submit" className="btn-accent-m" style={{ flex: 1, padding: '0.75rem', borderRadius: '4px' }}>
                  {editingProduct ? 'COMMIT CHANGES' : 'CREATE PRODUCT'}
                </button>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-primary-m" style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', background: '#ffffff', color: '#000000', borderColor: 'var(--color-gray-border)' }}>
                  CANCEL
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. DYNAMIC TAX INVOICE PRINT SCREEN (Mounted outside viewport, visible only during print call) */}
      {selectedInvoiceOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          zIndex: 4000,
          padding: '2.5rem',
          overflowY: 'auto'
        }} className="invoice-print-overlay">
          
          <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'var(--font-body)', color: '#000000' }}>
            
            {/* Control banner at top (Hidden during print) */}
            <div className="no-print" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-gray-border)',
              paddingBottom: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <strong>PRINT VIEWER: Order {selectedInvoiceOrder.id}</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handlePrintSelectedInvoice} className="btn-accent-m" style={{ padding: '0.45rem 1rem', fontSize: '0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Printer size={12} /> Trigger Print Dialog
                </button>
                <button onClick={() => setSelectedInvoiceOrder(null)} className="btn-primary-m" style={{ padding: '0.45rem 1rem', fontSize: '0.75rem', borderRadius: '4px', background: '#fff', color: '#000', borderColor: '#ccc' }}>
                  Close Viewer
                </button>
              </div>
            </div>

            {/* Core Invoice Sheet */}
            <div style={{ padding: '1rem', border: '1px solid #000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid #000', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '0.1em', margin: 0 }}>MAD MOOD</h2>
                  <span style={{ fontSize: '0.75rem', color: '#333' }}>Premium Menswear Marketplace // GSTIN: 27AAMCM6812H1Z4</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem' }}>COMMERCIAL TAX INVOICE</h3>
                  <span style={{ fontSize: '0.75rem' }}>ORIGINAL FOR RECIPIENT</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>SHIPPED TO / RECIPIENT:</strong>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 700 }}>{selectedInvoiceOrder.shippingAddress.label.toUpperCase()}</p>
                  <p style={{ margin: '0 0 2px 0' }}>{selectedInvoiceOrder.shippingAddress.streetAddress}, {selectedInvoiceOrder.shippingAddress.locality}</p>
                  <p style={{ margin: '0 0 2px 0' }}>{selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state} - {selectedInvoiceOrder.shippingAddress.pincode}</p>
                  <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>PHONE: {selectedInvoiceOrder.shippingAddress.phone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>INVOICE METADATA:</strong>
                  <p style={{ margin: '0 0 2px 0' }}>INVOICE ID: <strong>INV-{selectedInvoiceOrder.id.replace('MM-IND-', '26')}</strong></p>
                  <p style={{ margin: '0 0 2px 0' }}>ORDER DATE: {new Date(selectedInvoiceOrder.date).toLocaleString('en-IN')}</p>
                  <p style={{ margin: '0 0 2px 0' }}>PAYMENT METHOD: <strong style={{ textTransform: 'uppercase' }}>{selectedInvoiceOrder.paymentMethod}</strong></p>
                  <p style={{ margin: '0' }}>DELIVERY AGENT: <strong>MAD EXPRESS</strong></p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2.5px solid #000', textAlign: 'left' }}>
                    <th style={{ padding: '6px 0' }}>ITEM SPECIFICATION</th>
                    <th style={{ padding: '6px 0', textAlign: 'center' }}>SIZE</th>
                    <th style={{ padding: '6px 0', textAlign: 'center' }}>QTY</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>UNIT RATE (₹)</th>
                    <th style={{ padding: '6px 0', textAlign: 'right' }}>NET AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceOrder.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '10px 0', fontWeight: 600 }}>{item.product.name}</td>
                      <td style={{ padding: '10px 0', textAlign: 'center' }}>{item.size}</td>
                      <td style={{ padding: '10px 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right' }}>₹{item.priceAtPurchase.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700 }}>₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '230px', marginLeft: 'auto', borderTop: '1px solid #000', paddingTop: '1rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TAXABLE VALUE:</span>
                  <span>₹{selectedInvoiceOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                    <span>DISCOUNT COUPON:</span>
                    <span>-₹{selectedInvoiceOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CGST (9.0%):</span>
                  <span>₹{Math.round(selectedInvoiceOrder.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>SGST (9.0%):</span>
                  <span>₹{Math.round(selectedInvoiceOrder.gstAmount / 2).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>COURIER SHIPPING:</span>
                  <span>{selectedInvoiceOrder.shipping === 0 ? 'FREE' : `₹${selectedInvoiceOrder.shipping}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, borderTop: '2px solid #000', paddingTop: '8px', marginTop: '4px' }}>
                  <span>GRAND TOTAL:</span>
                  <span>₹{selectedInvoiceOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', borderTop: '1px solid #000', paddingTop: '1rem', fontSize: '0.75rem', color: '#333', textAlign: 'center', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>MAD MOOD</p>
                <p style={{ margin: '0 0 2px 0' }}>Unnao, Uttar Pradesh, India - 209801</p>
                <p style={{ margin: '0 0 6px 0' }}>Contact: +91 6386376901</p>
                <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.85 }}>This is an official computer-generated document and does not require an active physical stamp. Subject to Unnao jurisdiction.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media print {
          body * {
            visibility: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .invoice-print-overlay, .invoice-print-overlay * {
            visibility: visible !important;
          }
          .invoice-print-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

const sidebarBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '0.75rem 1rem',
  border: 'none',
  borderRadius: '4px',
  fontFamily: 'var(--font-heading)',
  fontSize: '0.85rem',
  fontWeight: 600,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
};

const kpiCardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-subtle)'
};

const kpiLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  color: 'var(--color-gray-text)',
  fontFamily: 'var(--font-heading)',
  letterSpacing: '0.05em'
};

const kpiValStyle: React.CSSProperties = {
  fontSize: '1.45rem',
  fontWeight: 800,
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-primary)'
};

const panelCardStyle: React.CSSProperties = {
  border: '1px solid var(--color-gray-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '2rem',
  backgroundColor: '#ffffff',
  boxShadow: 'var(--shadow-subtle)',
  height: 'max-content'
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--color-primary)',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--color-gray-border)',
  paddingBottom: '8px'
};

const productTagStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 700,
  padding: '1px 6px',
  background: 'var(--bg-gray-medium)',
  color: 'var(--color-primary)',
  borderRadius: '4px',
  fontFamily: 'var(--font-heading)'
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  color: 'var(--color-primary)',
  fontFamily: 'var(--font-heading)',
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '0.02em'
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  verticalAlign: 'middle',
  color: 'var(--color-gray-text)'
};

const actionBtnStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '6px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color-primary)',
  transition: 'all 0.15s ease'
};

const invActionBtnStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '2px 8px',
  fontSize: '0.7rem',
  fontWeight: 700,
  borderRadius: '4px',
  cursor: 'pointer'
};

const invAdjustBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: '0.75rem',
  fontWeight: 700,
  border: '1px solid var(--color-gray-border)',
  borderRadius: '4px',
  cursor: 'pointer'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-primary)',
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
  borderRadius: '4px',
  boxSizing: 'border-box'
};

export default AdminDashboard;
