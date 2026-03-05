import type { Transition, Easing } from 'framer-motion';

// Easing curves
export const EASE_OUT_EXPO: Easing = [0.19, 1, 0.22, 1];
export const EASE_OUT_QUINT: Easing = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT_CUBIC: Easing = [0.65, 0, 0.35, 1];

// Spring configs
export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export const SPRING_BOUNCY: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

export const SPRING_GENTLE: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export const SPRING_SMOOTH: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1.2,
};

// Tray transitions
export const TRAY_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.45,
  ease: EASE_OUT_EXPO,
};

export const BACKDROP_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeOut',
};

// Shared element transition
export const SHARED_ELEMENT_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 35,
  mass: 1,
};

// Grid stagger
export const gridItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: EASE_OUT_QUINT,
    },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// Heart reaction
export const heartVariants = {
  initial: { scale: 0, opacity: 1 },
  animate: {
    scale: [0, 1.3, 1],
    opacity: [1, 1, 0],
    y: [0, -60, -100],
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};
