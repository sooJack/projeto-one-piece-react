import { motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const pageTransition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
      {children}
    </motion.div>
  );
}
