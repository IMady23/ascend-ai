"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageMotion } from "@/utils/motion";
import { cn } from "@/utils/cn";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      variants={PageMotion.routeTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "w-full px-6 py-8 md:px-12 md:py-12",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
