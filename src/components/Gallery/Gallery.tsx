import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InvitationData } from '@/types';
import FadeIn from '@/components/shared/FadeIn';
import classes from './Gallery.module.css';

interface GalleryProps {
  data?: InvitationData;
}

export default function Gallery({ data }: GalleryProps) {
  const images = data?.galleryImages || [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Swipe detection states
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  if (images.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    // reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Stagger animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each image item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <h2 className={classes.title}>GALLERY</h2>
        <p className={classes.subtitle}>우리의 아름다운 순간들</p>
      </FadeIn>

      <motion.div
        className={classes.grid}
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
      >
        {images.map((src, index) => (
          <motion.div
            key={index}
            className={classes.imageWrapper}
            variants={itemVariants}
            onClick={() => setSelectedIndex(index)}
          >
            <img src={src} alt={`Gallery image ${index + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </motion.div>

      {/* Fullscreen Image Modal with Slider */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className={classes.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.button
              className={classes.closeButton}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedIndex(null)}
            >
              닫기
            </motion.button>
            
            <div 
              className={classes.modalContent}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={classes.navButton} onClick={handlePrev} aria-label="이전 사진">
                &#10094;
              </button>
              
              <div className={classes.imageContainer}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedIndex}
                    src={images[selectedIndex]}
                    alt={`Selected full screen ${selectedIndex + 1}`}
                    className={classes.modalImage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
                <div className={classes.pageIndicator}>
                  {selectedIndex + 1} / {images.length}
                </div>
              </div>

              <button className={classes.navButton} onClick={handleNext} aria-label="다음 사진">
                &#10095;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
