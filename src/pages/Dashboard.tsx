import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProducts, getOrders, updateUserAddress, deleteUserAddress } from '../services/db';
import type { Address, Order, Product } from '../services/db';
import { User, LogOut, Package, Heart, Edit, Trash2, Plus, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { currentUser, userLogout, refreshUser, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tabs state
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  // Address form states
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Orders list
  const [orders, setOrders] = useState<Order[]>([]);
  // Resolved wishlist products
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }

    // Handle initial tab from URL queries
    const tab = searchParams.get('tab');
    if (tab === 'wishlist') {
      setActiveTab('wishlist');
    } else if (tab === 'orders') {
      setActiveTab('orders');
    }

    // Load orders
    setOrders(getOrders());

    // Load wishlist products
    const all = getProducts();
    setWishlistProducts(all.filter(p => wishlist.includes(p.id)));
  }, [currentUser, wishlist, searchParams, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLabel.trim() || !streetAddress.trim() || !locality.trim() || !city.trim() || !pincode.trim() || !phone.trim()) {
      alert('REQUIRED FIELDS: Please fill in all fields.');
      return;
    }

    const payload = {
      label: addressLabel,
      streetAddress,
      locality,
      city,
      state,
      pincode,
      phone
    };

    updateUserAddress(payload, editingAddressId || undefined);
    refreshUser();
    resetAddressForm();
    alert('ADDRESS DATA SAVED IN PROFILE');
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressLabel('');
    setStreetAddress('');
    setLocality('');
    setCity('');
    setState('');
    setPincode('');
    setPhone('');
    setShowAddressForm(false);
  };

  const handleEditAddressClick = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressLabel(addr.label);
    setStreetAddress(addr.streetAddress);
    setLocality(addr.locality);
    setCity(addr.city);
    setState(addr.state || '');
    setPincode(addr.pincode);
    setPhone(addr.phone);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('CONFIRM DELETE: Do you wish to delete this address?')) {
      deleteUserAddress(id);
      refreshUser();
      alert('ADDRESS DELETED SUCCESSFULLY');
    }
  };

  const handleRemoveWishlist = (id: string) => {
    toggleWishlist(id);
  };

  return (
    <div style={{ padding: '4.5rem 0', minHeight: 'calc(100vh - 200px)', backgroundColor: 'var(--bg-white)' }}>
      <div className="container">
        
        {/* User Greeting Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-gray-border)',
          paddingBottom: '2rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-gray-text)', letterSpacing: '0.15em', fontWeight: 700 }}>
              CUSTOMER ACCOUNT PORTAL
            </span>
            <h1 style={{ fontSize: '2.2rem', marginTop: '4px', fontWeight: 800 }}>
              WELCOME, {currentUser.firstName.toUpperCase()} {currentUser.lastName.toUpperCase()}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-primary-m"
            style={{
              padding: '0.6rem 1.5rem',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '4px'
            }}
          >
            SIGN OUT <LogOut size={14} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--color-gray-border)',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'profile' ? 'var(--color-primary)' : 'var(--color-gray-text)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              padding: '0.75rem 1.5rem',
              fontWeight: activeTab === 'profile' ? 700 : 500,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} /> IDENTITY PROFILE
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-gray-text)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              padding: '0.75rem 1.5rem',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={14} /> ORDER HISTORY ({orders.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'wishlist' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'wishlist' ? 'var(--color-primary)' : 'var(--color-gray-text)',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              padding: '0.75rem 1.5rem',
              fontWeight: activeTab === 'wishlist' ? 700 : 500,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={14} /> MY WISHLIST ({wishlist.length})
            </span>
          </button>
        </div>

        {/* Tab Content viewport */}
        <div className="tab-viewport">
          
          {/* Identity profile tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem' }}>
              {/* Profile details */}
              <div style={{ 
                padding: '2rem', 
                height: 'max-content',
                border: '1px solid var(--color-gray-border)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-gray-light)',
                boxShadow: 'var(--shadow-subtle)'
              }}>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ACCOUNT INFORMATION
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-gray-border)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--color-gray-text)' }}>EMAIL ADDRESS:</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-black)' }}>{currentUser.email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-gray-border)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--color-gray-text)' }}>FIRST NAME:</span>
                    <span style={{ color: 'var(--color-black)' }}>{currentUser.firstName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-gray-border)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--color-gray-text)' }}>LAST NAME:</span>
                    <span style={{ color: 'var(--color-black)' }}>{currentUser.lastName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px' }}>
                    <span style={{ color: 'var(--color-gray-text)' }}>ACCOUNT STATUS:</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>ACTIVE USER</span>
                  </div>
                </div>
              </div>

              {/* Address Manager */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)' }}>SAVED ADDRESS BOOK</h3>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="btn-primary-m"
                      style={{
                        padding: '0.45rem 1.1rem',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px'
                      }}
                    >
                      <Plus size={12} /> NEW ADDRESS
                    </button>
                  )}
                </div>

                {/* Form panel for addresses */}
                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} style={{
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    border: '1px solid var(--color-gray-border)',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-subtle)'
                  }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, margin: 0, borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '6px' }}>
                      {editingAddressId ? 'EDIT ADDRESS DETAILS' : 'CREATE NEW ADDRESS'}
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>LABEL (e.g. HOME, OFFICE)</label>
                        <input type="text" value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)} style={inputStyle} required />
                      </div>
                      <div>
                        <label style={labelStyle}>PHONE CONNECTION</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} required />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>STREET ADDRESS</label>
                      <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} style={inputStyle} placeholder="Flat, House no., Building" required />
                    </div>

                    <div>
                      <label style={labelStyle}>LOCALITY / AREA</label>
                      <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} style={inputStyle} placeholder="Locality, Area, Sector" required />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={labelStyle}>CITY</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle} placeholder="e.g. Mumbai" required />
                      </div>
                      <div>
                        <label style={labelStyle}>STATE</label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} placeholder="e.g. Maharashtra" required />
                      </div>
                      <div>
                        <label style={labelStyle}>PINCODE</label>
                        <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} style={inputStyle} placeholder="6-digit PIN" required />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn-accent-m" style={{ flex: 1, padding: '0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>
                        SAVE ADDRESS
                      </button>
                      <button type="button" onClick={resetAddressForm} className="btn-primary-m" style={{ flex: 1, padding: '0.6rem', fontSize: '0.75rem', borderRadius: '4px', backgroundColor: '#ffffff', color: 'var(--color-black)', borderColor: 'var(--color-gray-border)' }}>
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                {/* List of addresses */}
                {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem' }}>No coordinates recorded. Add shipping addresses above.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentUser.addresses.map(addr => (
                      <div key={addr.id} style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid var(--color-gray-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffffff'
                      }}>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            background: 'var(--color-primary)',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            fontFamily: 'var(--font-heading)',
                            marginBottom: '8px',
                            borderRadius: '2px'
                          }}>{addr.label.toUpperCase()}</span>
                          <p style={{ fontSize: '0.85rem', marginBottom: '2px', color: '#000', fontWeight: 600 }}>{addr.streetAddress}, {addr.locality}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', margin: 0 }}>
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', marginTop: '4px', fontWeight: 500 }}>PHONE: {addr.phone}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => handleEditAddressClick(addr)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-text)', cursor: 'pointer' }}
                            title="Edit Address"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-text)', cursor: 'pointer' }}
                            title="Delete Address"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders History Tab */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  border: '1px dashed var(--color-gray-border)',
                  color: 'var(--color-gray-text)',
                  backgroundColor: 'var(--bg-gray-light)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', fontWeight: 600 }}>NO PLACED ORDERS YET</p>
                  <button onClick={() => navigate('/shop')} className="btn-primary-m" style={{ borderRadius: '4px' }}>
                    BROWSE APPAREL COLLECTION
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      style={{
                        padding: '2rem',
                        border: '1px solid var(--color-gray-border)',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        boxShadow: 'var(--shadow-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-black)' }}>
                            {order.id}
                          </span>
                          <span style={{
                            background: order.status === 'Delivered' || order.status === 'Paid' ? 'rgba(3, 166, 133, 0.08)' : 
                                        order.status === 'Cancelled' || order.status === 'Failed' ? 'rgba(255, 29, 64, 0.08)' : 
                                        'rgba(10, 29, 55, 0.08)',
                            border: `1.5px solid ${
                              order.status === 'Delivered' || order.status === 'Paid' ? 'var(--color-success)' : 
                              order.status === 'Cancelled' || order.status === 'Failed' ? '#ff1d40' : 
                              'var(--color-primary)'
                            }`,
                            color: order.status === 'Delivered' || order.status === 'Paid' ? 'var(--color-success)' : 
                                   order.status === 'Cancelled' || order.status === 'Failed' ? '#ff1d40' : 
                                   'var(--color-primary)',
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-heading)',
                            padding: '2px 8px',
                            fontWeight: 700,
                            borderRadius: '4px'
                          }}>{order.status.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', marginBottom: '10px' }}>
                          DATE: {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        
                        {/* Ordered item preview thumbnails */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          {order.items.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.product.images[0]}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                              }}
                              style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-gray-border)' }}
                              title={`${item.product.name} (Size: ${item.size}) x${item.quantity}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', margin: 0 }}>TOTAL CHARGED</p>
                        <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, margin: '2px 0 10px 0', color: 'var(--color-black)' }}>
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                        <button
                          onClick={() => navigate(`/order-tracking/${order.id}`)}
                          className="btn-primary-m"
                          style={{
                            padding: '0.45rem 1.1rem',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '4px'
                          }}
                        >
                          TRACK ORDER <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              {wishlistProducts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 2rem',
                  border: '1px dashed var(--color-gray-border)',
                  color: 'var(--color-gray-text)',
                  backgroundColor: 'var(--bg-gray-light)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', fontWeight: 600 }}>YOUR WISHLIST IS EMPTY</p>
                  <button onClick={() => navigate('/shop')} className="btn-primary-m" style={{ borderRadius: '4px' }}>
                    EXPLORE NEW ARRIVALS
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '2rem'
                }}>
                  {wishlistProducts.map(p => (
                    <div key={p.id} style={{
                      padding: '1rem',
                      background: '#ffffff',
                      border: '1px solid var(--color-gray-border)',
                      borderRadius: 'var(--radius-md)',
                      position: 'relative',
                      boxShadow: 'var(--shadow-subtle)'
                    }}>
                      {/* Delete from wishlist button */}
                      <button
                        onClick={() => handleRemoveWishlist(p.id)}
                        style={{
                          position: 'absolute',
                          top: '1.5rem',
                          right: '1.5rem',
                          background: 'rgba(255,255,255,0.9)',
                          border: '1px solid var(--color-gray-border)',
                          color: '#ff1d40',
                          padding: '6px',
                          borderRadius: '50%',
                          zIndex: 5,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                        }}
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>

                      <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <img 
                          src={p.images[0]} 
                          alt={p.name} 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800';
                          }}
                          style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} 
                        />
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--color-black)', fontWeight: 600, margin: '0 0 4px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.name}</h4>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>₹{p.price.toLocaleString('en-IN')}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontFamily: 'var(--font-heading)',
  color: 'var(--color-primary)',
  fontWeight: 700,
  marginBottom: '4px',
  letterSpacing: '0.04em'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid var(--color-gray-border)',
  padding: '0.55rem 0.75rem',
  color: '#000000',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  outline: 'none',
  borderRadius: '4px',
  boxSizing: 'border-box'
};
