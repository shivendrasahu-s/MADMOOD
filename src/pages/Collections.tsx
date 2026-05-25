import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';

export const Collections: React.FC = () => {
  const navigate = useNavigate();

  const drops = [
    {
      id: 'indigo-slub',
      title: 'ROYAL INDIGO // SLUB COTTON',
      code: 'CAPSULE.01',
      description: 'Hand-dyed slub cotton fabrics combined with contemporary oversized streetwear drop-shoulder silhouettes. Engineered for ease and cultural expression.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      category: 'Kurtas'
    },
    {
      id: 'street-linen',
      title: 'STREET UTILITY // LINEN COMPRESS',
      code: 'CAPSULE.02',
      description: 'Premium washed utility shirts crafted from durable linen-cotton fibers for maximum breathability under the Indian summer. Outfitted with double-pocket overlays.',
      image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
      category: 'Shirts'
    },
    {
      id: 'ripstop-cargos',
      title: 'TECHNICAL CARGOS // RIPSTOP CORE',
      code: 'CAPSULE.03',
      description: 'Tapered commuter cargos configured with spacious pocket systems, elasticized ankle cuffs, and reinforced stitch panels for urban navigation.',
      image: 'https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&q=80&w=800',
      category: 'Cargo Pants'
    }
  ];

  return (
    <div style={{ padding: '4rem 0', minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--color-red)', letterSpacing: '0.2em' }}>
            LOOKBOOKS & PROJECTS
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '4px', letterSpacing: '0.05em' }}>CAPSULE DROPS</h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--color-red)', margin: '1rem auto' }} />
        </div>

        {/* Grid Drop cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {drops.map((drop, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={drop.id}
                style={{
                  display: 'flex',
                  gap: '3rem',
                  alignItems: 'center',
                  flexDirection: isEven ? 'row' : 'row-reverse'
                }}
                className="collection-row"
              >
                {/* Visual Image container */}
                <div style={{
                  flex: 1.2,
                  position: 'relative',
                  paddingTop: '45%',
                  border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'hidden'
                }} className="collection-img-box">
                  <img
                    src={drop.image}
                    alt={drop.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(0.4)',
                      transition: 'transform var(--transition-slow), filter var(--transition-slow)'
                    }}
                    className="hover-trigger col-img"
                  />
                  {/* Floating matrix numbers overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(0,0,0,0.7)',
                    fontFamily: 'var(--font-header)',
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    color: 'var(--color-red)',
                    border: '1px solid var(--color-red-dim)',
                    letterSpacing: '0.1em'
                  }}>
                    {drop.code}
                  </div>
                </div>

                {/* Details info */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '0.75rem',
                    color: 'var(--color-red)',
                    letterSpacing: '0.15em',
                    display: 'block',
                    marginBottom: '8px'
                  }}>// ESTABLISHED CONCEPT</span>
                  
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                    {drop.title}
                  </h2>
                  
                  <p style={{
                    color: 'var(--color-silver)',
                    lineHeight: '1.6',
                    fontSize: '0.95rem',
                    marginBottom: '2rem'
                  }}>
                    {drop.description}
                  </p>

                  <button
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(drop.category)}`)}
                    className="btn-premium-red hover-trigger"
                    style={{
                      padding: '0.75rem 2rem',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    EXPLORE COLLECTION <Eye size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .collection-img-box:hover .col-img {
          transform: scale(1.05);
          filter: grayscale(0) !important;
        }
        @media (max-width: 820px) {
          .collection-row {
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .collection-img-box {
            padding-top: 60% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
