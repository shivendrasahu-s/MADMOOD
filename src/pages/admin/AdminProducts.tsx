import React, { useState, useEffect } from 'react';
import { 
  getProducts, 
  addProductAdmin, 
  updateProductAdmin, 
  deleteProductAdmin, 
  type Product 
} from '../../services/db';
import { Plus, Search, Edit, Trash2, X, AlertTriangle } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // CRUD Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState(1499);
  const [pMrp, setPMrp] = useState(2999);
  const [pCategory, setPCategory] = useState<Product['category']>('Oversized T-Shirts');
  const [pSizes, setPSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [pStock, setPStock] = useState(30);
  const [pImages, setPImages] = useState<string[]>(['', '']);
  const [pDetails, setPDetails] = useState<string[]>(['100% Combed Cotton', 'Boxy relaxed drape', 'Machine wash cold']);
  const [pIsBestSeller, setPIsBestSeller] = useState(false);
  const [pIsNewRelease, setPIsNewRelease] = useState(true);
  const [pColors, setPColors] = useState('');

  const loadProducts = () => {
    setLoading(true);
    setProducts(getProducts());
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setPId('ind-' + Math.floor(100 + Math.random() * 900));
    setPName('');
    setPDescription('');
    setPPrice(1499);
    setPMrp(2999);
    setPCategory('Oversized T-Shirts');
    setPSizes(['S', 'M', 'L', 'XL']);
    setPStock(30);
    setPImages(['https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800', '']);
    setPDetails(['100% Premium Heavy Cotton', 'Regular streetwear silhouette', 'Wash inside out']);
    setPIsBestSeller(false);
    setPIsNewRelease(true);
    setPColors('Classic Black, Sandstone');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
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
    setShowModal(true);
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

    try {
      if (editingProduct) {
        updateProductAdmin(payload);
        alert('PRODUCT RECORD UPDATED SUCCESSFULLY');
      } else {
        addProductAdmin(payload);
        alert('NEW PRODUCT RECORD CREATED');
      }
      setShowModal(false);
      loadProducts();
    } catch (err: any) {
      alert('DATABASE ERROR: ' + err.message);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('PERMANENT DELETION: Are you sure you want to remove this style from the live database?')) {
      deleteProductAdmin(id);
      loadProducts();
      alert('PRODUCT REMOVED');
    }
  };

  const handleSizeToggle = (size: string) => {
    setPSizes((prev) => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const categories = [
    'All',
    'Oversized T-Shirts',
    'Polo T-Shirts',
    'Premium Shirts',
    'Hoodies',
    'Sweatshirts',
    'Cargo Pants',
    'Jeans',
    'Sneakers',
    'Jackets',
    'Co-ord Sets',
    'Accessories'
  ];

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', fontSize: '0.85rem', color: 'var(--admin-text-secondary)', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>
        LOADING PRODUCT CATALOG...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.02em', margin: 0, fontFamily: 'var(--font-heading)' }}>PRODUCT DIRECTORY</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>Manage catalog layouts, pricing updates, and style entries.</p>
        </div>
        <button 
          onClick={openAddModal} 
          style={{ 
            background: 'var(--admin-primary)', 
            border: 'none', 
            color: 'var(--admin-bg)', 
            padding: '10px 20px', 
            borderRadius: 0, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '0.8rem',
            fontWeight: 'bold',
            fontFamily: 'var(--font-heading)'
          }}
          className="hover-trigger"
        >
          <Plus size={14} /> NEW APPAREL ENTRY
        </button>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div style={{
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
            placeholder="Search SKU or Title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={filterInputStyle}
          />
          <Search size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
        </div>

        {/* Categories selector */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                fontFamily: 'var(--font-heading)',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--admin-accent)' : 'var(--admin-border)',
                backgroundColor: selectedCategory === cat ? 'var(--admin-accent)' : 'transparent',
                color: selectedCategory === cat ? '#ffffff' : 'var(--admin-text)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-card-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <th style={thStyle}>SKU ID</th>
              <th style={thStyle}>IMAGE</th>
              <th style={thStyle}>TITLE</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>PRICE (MRP)</th>
              <th style={thStyle}>STOCK</th>
              <th style={thStyle}>MARKETING BADGES</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                  NO MATCHING PRODUCTS DETECTED IN CATALOGUE.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isLow = p.stock < 10;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--admin-border)', transition: 'background-color 0.2s' }} className="table-row-hover">
                    <td style={{ ...tdStyle, fontWeight: 'bold', color: 'var(--admin-accent)' }}>{p.id.toUpperCase()}</td>
                    <td style={tdStyle}>
                      <img src={p.images[0]} alt="" style={{ width: '36px', height: '44px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{p.name}</td>
                    <td style={tdStyle}>{p.category}</td>
                    <td style={tdStyle}>
                      ₹{p.price} <span style={{ textDecoration: 'line-through', color: 'var(--admin-text-secondary)', fontSize: '0.7rem', marginLeft: '4px' }}>₹{p.mrp}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: isLow ? '#ff1d40' : 'inherit' }}>{p.stock} units</span>
                        {isLow && <span title="Low stock warning" style={{ display: 'inline-flex', alignItems: 'center' }}><AlertTriangle size={12} color="#ff1d40" /></span>}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.isBestSeller && <span style={badgeStyle('gold')}>BESTSELLER</span>}
                        {p.isNewRelease && <span style={badgeStyle('primary')}>NEW DROP</span>}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button 
                          onClick={() => openEditModal(p)}
                          style={actionBtnStyle('edit')}
                          title="Edit product"
                        >
                          <Edit size={12} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          style={actionBtnStyle('delete')}
                          title="Delete product"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD DIALOG MODAL */}
      {showModal && (
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
            maxWidth: '650px',
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0 }}>
                {editingProduct ? 'EDIT SYSTEM PRODUCT RECORD' : 'CREATE NEW APPAREL NODE'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--admin-text)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>SKU ID (IDENTIFIER)</label>
                  <input
                    type="text"
                    value={pId}
                    onChange={(e) => setPId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    disabled={!!editingProduct}
                    style={modalInputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>APPAREL TITLE</label>
                  <input
                    type="text"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. MONOCHROME FRENCH TERRY HOODIE"
                    style={modalInputStyle}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Describe material compositions, cut dimensions..."
                  style={{ ...modalInputStyle, resize: 'none' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>PRICE (₹ SELLING)</label>
                  <input
                    type="number"
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    style={modalInputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>MRP (₹ STRIKE-THROUGH)</label>
                  <input
                    type="number"
                    value={pMrp}
                    onChange={(e) => setPMrp(Number(e.target.value))}
                    style={modalInputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>STOCK QUANTITY</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    style={modalInputStyle}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>CATEGORY</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as Product['category'])}
                    style={{ ...modalInputStyle, height: '38px', cursor: 'pointer' }}
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>COLORS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    value={pColors}
                    onChange={(e) => setPColors(e.target.value)}
                    placeholder="e.g. Stealth Black, Ash Gray"
                    style={modalInputStyle}
                  />
                </div>
              </div>

              {/* Sizes checkboxes */}
              <div>
                <label style={labelStyle}>AVAILABLE SIZE INDEXES</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                    const isChecked = pSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => handleSizeToggle(sz)}
                        style={{
                          width: '36px',
                          height: '36px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          border: '1px solid',
                          borderColor: isChecked ? 'var(--admin-accent)' : 'var(--admin-border)',
                          backgroundColor: isChecked ? 'var(--admin-accent)' : 'transparent',
                          color: isChecked ? '#ffffff' : 'var(--admin-text)',
                          cursor: 'pointer',
                          borderRadius: 0,
                          transition: 'all 0.2s'
                        }}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image list URLs */}
              <div>
                <label style={labelStyle}>PRODUCT IMAGE URLS (UP TO 3)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {pImages.map((img, idx) => (
                    <input
                      key={idx}
                      type="url"
                      placeholder={`Image link ${idx + 1}...`}
                      value={img}
                      onChange={(e) => {
                        const updated = [...pImages];
                        updated[idx] = e.target.value;
                        setPImages(updated);
                      }}
                      style={modalInputStyle}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setPImages([...pImages, ''])}
                    style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--admin-accent)', fontSize: '0.65rem', fontWeight: 'bold', textDecoration: 'underline', padding: 0, cursor: 'pointer' }}
                  >
                    + Add Image URL Node
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--admin-border)', paddingTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={pIsBestSeller}
                    onChange={(e) => setPIsBestSeller(e.target.checked)}
                  />
                  MARK AS BESTSELLER
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={pIsNewRelease}
                    onChange={(e) => setPIsNewRelease(e.target.checked)}
                  />
                  MARK AS NEW RELEASE
                </label>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'var(--admin-primary)',
                  color: 'var(--admin-bg)',
                  border: 'none',
                  padding: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                COMMIT STYLE TO DATABASE
              </button>
            </form>
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

// Styling parameters
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

const badgeStyle = (type: 'gold' | 'primary'): React.CSSProperties => ({
  fontSize: '0.55rem',
  fontWeight: 800,
  padding: '1px 6px',
  color: type === 'gold' ? '#ffffff' : '#000000',
  backgroundColor: type === 'gold' ? 'var(--admin-accent)' : 'rgba(0,0,0,0.06)',
  border: type === 'gold' ? 'none' : '1px solid var(--admin-border)',
  letterSpacing: '0.05em'
});

const actionBtnStyle = (type: 'edit' | 'delete'): React.CSSProperties => ({
  background: 'transparent',
  border: '1px solid var(--admin-border)',
  color: type === 'delete' ? '#ff1d40' : 'var(--admin-text)',
  padding: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontFamily: 'var(--font-heading)',
  fontWeight: 800,
  color: 'var(--admin-text-secondary)',
  marginBottom: '4px',
  letterSpacing: '0.05em'
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--admin-card-bg)',
  border: '1px solid var(--admin-border)',
  padding: '0.55rem 0.75rem',
  color: 'var(--admin-text)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.75rem',
  outline: 'none',
  borderRadius: 0,
  boxSizing: 'border-box'
};

export default AdminProducts;
