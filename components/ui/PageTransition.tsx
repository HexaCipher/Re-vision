"use client";

import { motion, type Transition, type Variants } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// Use a cubic bezier easing as a tuple for proper typing
const customEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const springTransition: Transition = { type: "spring", stiffness: 300, damping: 30 };
const smoothSpring: Transition = { type: "spring", stiffness: 200, damping: 25 };

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

// Hover scale effect for cards and buttons
export function HoverScale({ 
  children, 
  className = "", 
  scale = 1.02,
  style 
}: PageTransitionProps & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation for attention-grabbing elements
export function Pulse({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.02, 1],
        opacity: [1, 0.9, 1]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Float animation for decorative elements
export function Float({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Shimmer loading effect
export function Shimmer({ className = "", style }: Omit<PageTransitionProps, 'children'>) {
  return (
    <motion.div
      className={`bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "linear"
      }}
      style={style}
    />
  );
}

// Reveal on scroll (intersection observer based)
export function RevealOnScroll({ 
  children, 
  className = "", 
  style,
  threshold = 0.1 
}: PageTransitionProps & { threshold?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.6, ease: customEase }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Counter animation for numbers
export function AnimatedCounter({ 
  value, 
  className = "",
  duration = 2 
}: { 
  value: number; 
  className?: string;
  duration?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
}

// Button press effect
export function PressableButton({ 
  children, 
  className = "", 
  onClick,
  disabled = false,
  style 
}: PageTransitionProps & { onClick?: () => void; disabled?: boolean }) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={springTransition}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}

// Stagger grid for card layouts
export function StaggerGrid({ 
  children, 
  className = "", 
  style,
  staggerDelay = 0.05 
}: PageTransitionProps & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
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

// Grid item with scale animation
export function GridItem({ children, className = "", style }: PageTransitionProps) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, scale: 0.9 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: smoothSpring
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export { pageVariants, childVariants, customEase, springTransition, smoothSpring };
