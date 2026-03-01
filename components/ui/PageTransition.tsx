"use client";

import { motion, type Transition } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Use a cubic bezier easing as a tuple for proper typing
const customEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: customEase,
      staggerChildren: 0.1,
    } as Transition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut" as const,
    } as Transition,
  },
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: customEase,
    } as Transition,
  },
};

export function PageTransition({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = "", delay = 0, style }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: customEase }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className = "", direction = "left", delay = 0, style }: PageTransitionProps & { direction?: "left" | "right" | "up" | "down"; delay?: number }) {
  const directionOffset = {
    left: { x: -30, y: 0 },
    right: { x: 30, y: 0 },
    up: { x: 0, y: -30 },
    down: { x: 0, y: 30 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: customEase }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className = "", delay = 0, style }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: customEase }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      variants={childVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export { pageVariants, childVariants };
