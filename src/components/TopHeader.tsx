import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAnnouncements } from '../services/db';

export const TopHeader: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    // Fetch dynamic announcements from database
    const list = getAnnouncements();
    setAnnouncements(list);
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements]);

  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      height: '35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      fontWeight: 700,
      fontFamily: 'var(--font-heading)',
      letterSpacing: '0.12em',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1001,
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      {announcements.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-gold)', // Elegant gold text accent
              textAlign: 'center',
              padding: '0 1rem'
            }}
          >
            <span style={{ color: '#ffffff', fontSize: '0.6rem' }}>●</span> {announcements[currentIdx]} <span style={{ color: '#ffffff', fontSize: '0.6rem' }}>●</span>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TopHeader;
