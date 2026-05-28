import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts, parseSearchQuery, type ParsedQuery } from '../services/searchService';
import { type Product } from '../services/db';
import { ProductCard } from '../components/ProductCard';
import { ArrowUpDown, X } from 'lucide-react';

interface SearchPageProps {
  onQuickView: (product: Product) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onQuickView }) => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  // Local filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(8000);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');

  // Parsed query details (for showing user search metadata details)
  const [parsedQueryDetails, setParsedQueryDetails] = useState<ParsedQuery | null>(null);

  // Sync parameters from query parsing on URL query changes
  useEffect(() => {
    const parsed = parseSearchQuery(q);
    setParsedQueryDetails(parsed);

    // Apply auto-detected filter fields
    if (parsed.detectedColors.length > 0) {
      setSelectedColors(parsed.detectedColors);
    } else {
      setSelectedColors([]);
    }

    if (parsed.detectedCategories.length > 0) {
      setSelectedCategories(parsed.detectedCategories);
    } else {
      setSelectedCategories([]);
    }

    if (parsed.detectedSizes.length > 0) {
      setSelectedSizes(parsed.detectedSizes);
    } else {
      setSelectedSizes([]);
    }

    setPriceMax(parsed.priceMax !== null ? parsed.priceMax : 8000);
    setPriceMin(parsed.priceMin !== null ? parsed.priceMin : 0);
  }, [q]);

  // Query search output (base results prior to local sidebar checks)
  const baseResults = searchProducts(q);

  // Gather unique colors, categories from base results to construct dynamic filters list
  const uniqueCategories = Array.from(new Set(baseResults.map(p => p.category)));
  const uniqueColors = Array.from(
    new Set(baseResults.flatMap(p => p.colors || []).map(c => c.toLowerCase()))
  );
  const allSizes = ['S', 'M', 'L', 'XL', '30', '32', '34', '36', '7', '8', '9', '10'];

  // Apply sidebar filters
  const filteredProducts = baseResults.filter(p => {
    // 1. Local category check
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
      return false;
    }
    // 2. Local color check
    if (selectedColors.length > 0) {
      const colorsLower = (p.colors || []).map(c => c.toLowerCase());
      const hasColorMatch = colorsLower.some(c => 
        selectedColors.some(sc => c.includes(sc) || sc.includes(c))
      );
      if (!hasColorMatch) return false;
    }
    // 3. Local size check
    if (selectedSizes.length > 0) {
      const hasSizeMatch = p.sizes.some(s => selectedSizes.includes(s));
      if (!hasSizeMatch) return false;
    }
    // 4. Local price check
    if (p.price < priceMin || p.price > priceMax) {
      return false;
    }
    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      const getRatingAvg = (p: Product) => 
        p.reviews.length > 0 
          ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
          : 0;
      return getRatingAvg(b) - getRatingAvg(a);
    }
    if (sortBy === 'newest') {
      const isANew = a.isNewRelease ? 1 : 0;
      const isBNew = b.isNewRelease ? 1 : 0;
      return isBNew - isANew;
    }
    // 'relevance' (default: matches relevance ranked array orders)
    return 0; 
  });

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceMin(0);
    setPriceMax(8000);
    setSortBy('relevance');
  };

  return (
    <div style={{
      padding: '7rem 0 5rem 0',
      minHeight: 'calc(100vh - 120px)',
      backgroundColor: '#fafafa',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="container">
        
        {/* Search Results Summary Header */}
        <div style={{
          marginBottom: '2.5rem',
          borderBottom: '1px solid #111',
          paddingBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888',
              fontWeight: 600,
              display: 'block',
              marginBottom: '0.25rem'
            }}>Search Catalog</span>
            <h1 style={{
              fontSize: '1.75rem',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: '#111',
              margin: 0
            }}>
              RESULTS FOR: &ldquo;{q}&rdquo;
            </h1>
            
            {/* Show intelligent parsed filters meta info if detected */}
            {parsedQueryDetails && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {parsedQueryDetails.detectedCategories.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', backgroundColor: '#e5e7eb', padding: '2px 8px', textTransform: 'uppercase', fontWeight: 600, color: '#4b5563' }}>Category: {c}</span>
                ))}
                {parsedQueryDetails.detectedColors.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', backgroundColor: '#fef3c7', padding: '2px 8px', textTransform: 'uppercase', fontWeight: 600, color: '#d97706' }}>Color: {c}</span>
                ))}
                {parsedQueryDetails.detectedSizes.map((s, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', backgroundColor: '#d1fae5', padding: '2px 8px', textTransform: 'uppercase', fontWeight: 600, color: '#059669' }}>Size: {s}</span>
                ))}
                {(parsedQueryDetails.priceMax !== null || parsedQueryDetails.priceMin !== null) && (
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#fee2e2', padding: '2px 8px', textTransform: 'uppercase', fontWeight: 600, color: '#dc2626' }}>
                    Price: {parsedQueryDetails.priceMin !== null ? `₹${parsedQueryDetails.priceMin}+` : ''} {parsedQueryDetails.priceMax !== null ? `Under ₹${parsedQueryDetails.priceMax}` : ''}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sort Controller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#888',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ArrowUpDown size={12} /> SORT BY //
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #111111',
                borderRadius: '0px',
                color: '#111111',
                padding: '0.4rem 1rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="relevance">RELEVANCE</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">TOP RATED</option>
              <option value="newest">NEW ARRIVALS</option>
            </select>
          </div>
        </div>

        {/* Main Columns Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: '3rem',
          alignItems: 'start'
        }} className="shop-layout-row">
          
          {/* LEFT SIDEBAR FILTERS */}
          <div className="shop-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Clear Filters indicator */}
            {(selectedCategories.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || priceMin > 0 || priceMax < 8000) && (
              <button
                onClick={handleResetFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#fecaca',
                  color: '#b91c1c',
                  border: '1px solid #f87171',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                  textTransform: 'uppercase',
                  borderRadius: '0px'
                }}
              >
                <X size={14} /> Clear All Filters
              </button>
            )}

            {/* Categories filter */}
            {uniqueCategories.length > 1 && (
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', marginBottom: '1rem' }}>
                  Categories
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {uniqueCategories.map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#444', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        style={{ accentColor: '#111' }}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Filter */}
            {uniqueColors.length > 0 && (
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', marginBottom: '1rem' }}>
                  Colors
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {uniqueColors.map(color => {
                    const isSelected = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorToggle(color)}
                        style={{
                          backgroundColor: isSelected ? '#111' : '#fff',
                          color: isSelected ? '#fff' : '#111',
                          border: '1px solid #111',
                          padding: '4px 10px',
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                          fontWeight: 600,
                          cursor: 'pointer',
                          borderRadius: '0px'
                        }}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes Filter */}
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', marginBottom: '1rem' }}>
                Sizes
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {allSizes.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        background: isSelected ? '#111' : 'transparent',
                        color: isSelected ? '#fff' : '#111',
                        border: `1px solid ${isSelected ? '#111' : '#ccc'}`,
                        minWidth: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '0px',
                        transition: 'all 0.1s ease'
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price slider filter */}
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111', marginBottom: '1rem' }}>
                Price Limit: Under ₹{priceMax}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="250"
                  value={priceMax}
                  onChange={(e) => setPriceMax(parseInt(e.target.value, 10))}
                  style={{ accentColor: '#111', width: '100%', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#888' }}>
                  <span>₹0</span>
                  <span>₹5,000</span>
                  <span>₹10,000</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR PRODUCTS GRID */}
          <div style={{ flexGrow: 1 }}>
            
            {/* Count info bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.75rem',
              color: '#888',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              <span>Showed {sortedProducts.length} results</span>
            </div>

            {sortedProducts.length === 0 ? (
              /* Empty state suggestions */
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                border: '1px dashed #ccc',
                backgroundColor: '#fff'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>
                  NO MATCHES FOUND FOR &ldquo;{q}&rdquo;
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  We couldn&rsquo;t find anything matching your exact query and filters. Try adjusting your filters or search something else.
                </p>
                <button
                  onClick={handleResetFilters}
                  style={{
                    backgroundColor: '#111',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '0px'
                  }}
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2.5rem'
              }}>
                {sortedProducts.map(p => (
                  <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
export default SearchPage;
