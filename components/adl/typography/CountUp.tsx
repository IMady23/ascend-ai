"use client";

import React, { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "@/utils/cn";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.2,
  className,
  decimals = 0,
  prefix = "",
  suffix = ""
}: CountUpProps) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(currentValue) {
        setValue(currentValue);
      },
    });

    return () => controls.stop();
  }, [from, to, duration]);

  return (
    <span className={cn("inline-block tabular-nums", className)}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
