import { useContext } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EasterEggModeContext } from '@/context/EasterEggModeContext';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

const viewport = { once: true, margin: '-50px' } as const;

export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  yOffset = 30,
  className = '',
}: FadeInProps) {
  const mode = useContext(EasterEggModeContext);

  // 개발자 버전: 터미널에 한 줄씩 왼쪽에서 오른쪽으로 출력되는 느낌.
  if (mode === 'developer') {
    return (
      <motion.div
        initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
        viewport={viewport}
        transition={{ duration: 0.5, delay, ease: 'linear' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // 디자이너 버전: Y2K 감성의 통통 튀는 등장.
  if (mode === 'designer') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={viewport}
        transition={{ type: 'spring', stiffness: 260, damping: 15, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
