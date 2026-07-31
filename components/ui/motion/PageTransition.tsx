'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        mass: 1
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
