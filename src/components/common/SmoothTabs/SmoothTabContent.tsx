import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { SmoothTabContentProps } from './types';

// Spring physics and cubic-bezier curves matching high-end motion UX specs
const contentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 16 : direction < 0 ? -16 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 400, damping: 35 },
      opacity: { duration: 0.22, ease: [0.25, 1, 0.5, 1] },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -16 : direction < 0 ? 16 : 0,
    opacity: 0,
    transition: {
      x: { duration: 0.16, ease: [0.25, 1, 0.5, 1] },
      opacity: { duration: 0.16 },
    },
  }),
};

export const SmoothTabContent: React.FC<SmoothTabContentProps> = ({
  activeKey,
  direction,
  children,
  className = '',
  enableSmoothHeight = true,
}) => {
  return (
    <motion.div
      className={`smooth-tabs__pane-wrapper ${className}`}
      layout={enableSmoothHeight ? 'size' : false}
      transition={{
        layout: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
      }}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={activeKey}
          custom={direction}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="smooth-tabs__pane"
          style={{ willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
