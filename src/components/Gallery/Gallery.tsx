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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  if (images.length === 0) return null;

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
            onClick={() => setSelectedImage(src)}
          >
            <img src={src} alt={`Gallery image ${index + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </motion.div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className={classes.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className={classes.closeButton}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedImage(null)}
            >
              닫기
            </motion.button>
            <motion.img
              src={selectedImage}
              alt="Selected full screen"
              className={classes.modalImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
