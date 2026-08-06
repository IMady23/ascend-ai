"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const AnimatedNumber = ({ value }: { value: number }) => {
  const reducedMotion = useReducedMotion();
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (reducedMotion) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, { duration: 0.35 });
    return controls.stop;
  }, [count, value, reducedMotion]);

  if (reducedMotion) {
    return <span>{Math.round(value)}</span>;
  }

  return <motion.span>{rounded}</motion.span>;
};
