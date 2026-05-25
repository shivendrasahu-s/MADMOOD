import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../services/db';
import type { Product } from '../services/db';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface ShopProps {
  onQuickView: (product: Product) => void;
}

export const Shop: React.FC<ShopProps> = ({ onQuickView }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSize, setSelectedSize] = useState('All');
  const location = useLocation();

  useEffect(() => {
    const allProducts = getProducts();
    setProducts(allProducts);
    setFilteredProducts(allProducts);

    // Read URL search params (e.g. from navbar search query or mega menu)
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Size Filter
    if (selectedSize !== 'All') {
      result = result.filter(p => p.sizes.includes(selectedSize));
    }

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNewRelease ? 1 : 0) - (a.isNewRelease ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedSize, searchQuery, sortBy, products]);

  const categories = ['All', 'Oversized T-Shirts', 'Polo T-Shirts', 'Premium Shirts', 'Hoodies', 'Sweatshirts', 'Cargo Pants', 'Jeans', 'Sneakers', 'Jackets', 'Co-ord Sets', 'Summer Wear', 'Formal Wear', 'Streetwear', 'Accessories'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', '7', '8', '9', '10', '30', '32', '34', '36', 'One Size'];

  return (
    <div style={{ padding: '4.5rem 0', minHeight: 'calc(100vh - 200px)', backgroundColor: 'var(--bg-white)' }}>
      <div className="container">
        
        {/* Page Title Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--color-primary)', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase' }}>
            READY-TO-WEAR ARCHIVE
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '6px', letterSpacing: '0.04em', fontWeight: 800 }}>MENSWEAR COLLECTION</h1>
          <div style={{ width: '50px', height: '2px', background: 'var(--color-primary)', margin: '1.25rem auto' }} />
        </div>

        {/* Filter Controls Header Panel */}
        <div style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '3rem',
          border: '1px solid var(--color-gray-border)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-gray-light)',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          {/* Search bar inside shop */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder="SEARCH CATALOG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--color-gray-border)',
                padding: '0.55rem 0.55rem 0.55rem 2.2rem',
                color: 'var(--color-black)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                outline: 'none',
                borderRadius: '4px'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }} />
          </div>

          {/* Sort selection */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gray-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <SlidersHorizontal size={12} /> SORT BY // 
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-gray-border)',
                  color: 'var(--color-black)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  padding: '0.45rem 1.25rem 0.45rem 0.75rem',
                  outline: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">RECOMMENDED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="newest">NEW ARRIVALS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories sidebar + grid layout */}
        <div style={{ display: 'flex', gap: '3.5rem', flexDirection: 'row' }} className="shop-layout-row">
          
          {/* Sidebar Filters */}
          <div className="shop-sidebar" style={{ width: '240px', flexShrink: 0 }}>
            {/* Category Filter */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                CATEGORIES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-gray-text)',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: selectedCategory === cat ? 700 : 400,
                      padding: '4px 0',
                      transition: 'all 0.2s ease',
                      borderLeft: selectedCategory === cat ? '2px solid var(--color-primary)' : '2px solid transparent',
                      paddingLeft: selectedCategory === cat ? '8px' : '4px'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ paddingBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.85rem', marginBottom: '1.25rem', paddingBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                FILTER BY SIZE
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      background: selectedSize === size ? 'var(--color-primary)' : 'transparent',
                      color: selectedSize === size ? '#ffffff' : 'var(--color-black)',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-gray-border)',
                      padding: '4px 8px',
                      fontSize: '0.7rem',
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      borderRadius: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid list container */}
          <div style={{ flexGrow: 1 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--color-gray-text)',
              fontFamily: 'var(--font-body)',
              fontWeight: 500
            }}>
              <span>SHOWING {filteredProducts.length} PREMIUM PRODUCTS</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '6rem 2rem',
                border: '1px dashed var(--color-gray-border)',
                color: 'var(--color-gray-text)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-gray-light)'
              }}>
                <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', fontWeight: 600 }}>NO PRODUCTS MATCHING FILTERS</p>
                 <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedSize('All');
                    setSearchQuery('');
                  }}
                  className="btn-primary-m"
                  style={{ borderRadius: '4px', padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2.25rem'
              }}>
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-layout-row {
            flex-direction: column !important;
          }
          .shop-sidebar {
            width: 100% !important;
            margin-bottom: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};
export default Shop;
