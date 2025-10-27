'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface StepTransitionProps {
  children: ReactNode
  stepKey: string | number
  direction?: 'forward' | 'backward'
  className?: string
}

/**
 * Composant pour des transitions fluides entre les étapes du formulaire
 * Utilise Framer Motion pour des animations sophistiquées
 */
export function StepTransition({
  children,
  stepKey,
  direction = 'forward',
  className = '',
}: StepTransitionProps) {
  const variants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  }

  const transition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Composant pour les transitions de contenu avec effet de glissement
 */
export function SlideTransition({
  children,
  isVisible,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: ReactNode
  isVisible: boolean
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}) {
  const directionMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  }

  return (
    <motion.div
      initial={{
        ...directionMap[direction],
        opacity: 0,
      }}
      animate={
        isVisible
          ? {
              x: 0,
              y: 0,
              opacity: 1,
            }
          : {
              ...directionMap[direction],
              opacity: 0,
            }
      }
      transition={{
        type: 'spring' as const,
        stiffness: 260,
        damping: 20,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Composant pour les animations de pulsation et de respiration
 */
export function PulseAnimation({
  children,
  intensity = 'subtle',
  className = '',
}: {
  children: ReactNode
  intensity?: 'subtle' | 'medium' | 'strong'
  className?: string
}) {
  const scaleMap = {
    subtle: [1, 1.02, 1],
    medium: [1, 1.05, 1],
    strong: [1, 1.1, 1],
  }

  return (
    <motion.div
      animate={{
        scale: scaleMap[intensity],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
