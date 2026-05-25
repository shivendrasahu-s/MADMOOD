import React from 'react';
import { Cpu, Zap, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <span style={{ fontFamily: 'var(--font-header)', fontSize: '0.7rem', color: 'var(--color-red)', letterSpacing: '0.2em' }}>
            THE BRAND PHILOSOPHY
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '4px', letterSpacing: '0.05em' }}>BRAND STORY</h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--color-red)', margin: '1rem auto' }} />
        </div>

        {/* Narrative layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="about-grid">
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-red)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
              // BEYOND FABRIC
            </h2>
            <p style={{
              color: 'var(--color-white)',
              lineHeight: '1.8',
              fontSize: '1.1rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
              letterSpacing: '0.01em'
            }}>
              MAD MOOD is a premium modern men’s fashion brand built on confidence, individuality, and elevated streetwear culture.
            </p>
            <p style={{
              color: 'var(--color-silver-light)',
              lineHeight: '1.8',
              fontSize: '0.95rem',
              marginBottom: '1rem'
            }}>
              Established in 2026, **MAD MOOD** was forged to resist standard commodification. We don't analyze trends or monitor fashion schedules. We translate raw emotions, structural rebellion, and streetwear culture into premium physical fabrics.
            </p>
            <p style={{
              color: 'var(--color-silver)',
              lineHeight: '1.8',
              fontSize: '0.9rem'
            }}>
              Every garment undergoes meticulous design, fabric inspection, and stitching to ensure optimal quality and durability in daily wear. We make clothing for self-expression and elevated identity.
            </p>
          </div>

          <div style={{
            position: 'relative',
            paddingTop: '65%',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"
              alt="Brand Core"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(1)'
              }}
            />
          </div>
        </div>

        {/* Philosophy Cards Grid */}
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '3rem', letterSpacing: '0.15em' }}>
            CORE VALUES
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-panel hover-trigger" style={{ padding: '2.5rem', textAlign: 'center', transition: '0.3s' }}>
              <Cpu size={32} color="var(--color-red)" style={{ marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>SUSTAINABLE CRAFT</h3>
              <p style={{ color: 'var(--color-silver)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                Leveraging local handloom fabrics, organic cotton, and fusion tailoring for modern utility wear.
              </p>
            </div>

            <div className="glass-panel hover-trigger" style={{ padding: '2.5rem', textAlign: 'center', transition: '0.3s' }}>
              <Zap size={32} color="var(--color-red)" style={{ marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>ATTITUDE & EXPRESSION</h3>
              <p style={{ color: 'var(--color-silver)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                We believe apparel represents self-expression. A wearable manifestation of character, attitude, and state of mind.
              </p>
            </div>

            <div className="glass-panel hover-trigger" style={{ padding: '2.5rem', textAlign: 'center', transition: '0.3s' }}>
              <Compass size={32} color="var(--color-red)" style={{ marginBottom: '1.25rem' }} />
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>FAIR PRODUCTION</h3>
              <p style={{ color: 'var(--color-silver)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                All products are manufactured in certified, ethical Indian factories using premium materials.
              </p>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section style={{ marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '3.5rem', letterSpacing: '0.15em', fontFamily: 'var(--font-header)' }}>
            THE FOUNDERS
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem'
          }} className="founders-grid">
            
            {/* Founder 1 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'radial-gradient(circle, #252525, #0a0a0a)', border: '1px solid var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-header)', color: 'var(--color-red)' }}>PS</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.05em' }}>Mr. Pushpendra Sahu</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)', letterSpacing: '0.1em' }}>CO-FOUNDER & CREATIVE HEAD</span>
            </div>

            {/* Founder 2 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'radial-gradient(circle, #252525, #0a0a0a)', border: '1px solid var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-header)', color: 'var(--color-red)' }}>SS</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.05em' }}>Mr. Shivendra Sahu</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)', letterSpacing: '0.1em' }}>CO-FOUNDER & TECHNICAL ARCHITECT</span>
            </div>

            {/* Founder 3 */}
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'radial-gradient(circle, #252525, #0a0a0a)', border: '1px solid var(--color-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-header)', color: 'var(--color-red)' }}>DS</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px', letterSpacing: '0.05em' }}>Mr. Dipendra Sahu</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-silver)', fontFamily: 'var(--font-header)', letterSpacing: '0.1em' }}>CO-FOUNDER & OPERATIONS DIRECTOR</span>
            </div>

          </div>
        </section>

      </div>
      <style>{`
        .glass-panel:hover {
          border-color: var(--color-red) !important;
          box-shadow: 0 0 15px var(--color-red-glow);
          transform: translateY(-4px);
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
