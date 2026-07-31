'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  format = (val) => Math.round(val).toLocaleString(),
  duration = 1000,
  className = ""
}: AnimatedCounterProps) {
  const spring = useSpring(value, { stiffness: 100, damping: 30, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(format(value));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return spring.onChange((current) => {
      setDisplayValue(format(current));
    });
  }, [spring, format]);

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  );
}
