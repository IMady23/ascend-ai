import { Variants } from "framer-motion";

export const Timing = {
  fast: 0.15,
  medium: 0.3,
  slow: 0.6,
  verySlow: 1.2
};

export const NavigationMotion = {
  sidebarCollapse: {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  itemHover: {
    hover: { x: 4, transition: { duration: Timing.fast } },
  },
};

export const PageMotion = {
  routeTransition: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: Timing.slow, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: Timing.medium } },
  },
  staggerContainer: {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08 }, // 80ms stagger as requested
    },
  },
  staggerItem: {
    initial: { opacity: 0, y: 40, rotateX: 15 },
    animate: { opacity: 1, y: 0, rotateX: 0, transition: { duration: Timing.slow, ease: [0.25, 0.1, 0.25, 1] } },
  },
};

export const CardMotion = {
  hoverLift: {
    hover: { 
      y: -8, 
      scale: 1.015,
      transition: { duration: Timing.medium, ease: "easeOut" } 
    },
    tap: { scale: 0.98 }
  },
};

export const ButtonMotion = {
  tap: { scale: 0.95 },
  hover: { scale: 1.03, transition: { duration: Timing.fast } },
};

export const HeroMotion = {
  reveal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: Timing.slow, ease: "easeOut" } }
  }
};

export const ChartMotion = {
  draw: {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
  }
};

export const AIMotion = {
  thinking: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
    }
  },
  streaming: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: Timing.fast } }
  }
};

export const ProgressMotion = {
  fill: {
    initial: { width: "0%" },
    animate: (value: number) => ({ width: `${value}%`, transition: { duration: 1, type: "spring" as const, damping: 20 } })
  }
};

export const FeedbackMotion = {
  dialogReveal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: Timing.fast } },
  },
  toastSlide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 25 } },
    exit: { opacity: 0, y: 20 }
  }
};

export const HallMotion = {
  room: {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: Timing.slow, ease: [0.25, 0.1, 0.25, 1] } },
    exit: { opacity: 0, y: -30, filter: "blur(12px)", transition: { duration: Timing.slow, ease: "easeIn" } }
  }
};
