'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  useViewportAnimation,
  useViewportStagger,
  useViewportCounter,
  useViewportReveal,
  useViewportScale,
} from '@/hooks/useViewportAnimations'

interface ViewportAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  rootMargin?: string
}

/**
 * Composant pour les animations de révélation au scroll
 */
export function ViewportReveal({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  direction = 'up',
  distance = 50,
}: ViewportAnimationProps & {
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  const { ref, isInView, initialTransform, animateTransform } = useViewportReveal(
    direction,
    distance,
    { delay, threshold, rootMargin }
  )

  return (
    <motion.div
      ref={ref}
      initial={{
        ...initialTransform,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              ...animateTransform,
              opacity: 1,
            }
          : {
              ...initialTransform,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Composant pour les animations de scale au scroll
 */
export function ViewportScale({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  initialScale = 0.8,
  targetScale = 1,
}: ViewportAnimationProps & {
  initialScale?: number
  targetScale?: number
}) {
  const {
    ref,
    isInView,
    initialScale: currentInitialScale,
    animateScale,
  } = useViewportScale(initialScale, targetScale, { delay, threshold, rootMargin })

  return (
    <motion.div
      ref={ref}
      initial={{
        scale: currentInitialScale,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              scale: animateScale,
              opacity: 1,
            }
          : {
              scale: currentInitialScale,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Composant pour les animations en cascade au scroll
 */
export function ViewportStagger({
  children,
  className,
  staggerDelay = 100,
  threshold = 0.1,
  rootMargin = '0px',
}: ViewportAnimationProps & {
  staggerDelay?: number
}) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const { ref, isInView, visibleItems } = useViewportStagger(
    childrenArray.length,
    staggerDelay,
    { threshold, rootMargin }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95,
          }}
          animate={
            visibleItems.includes(index)
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
              : {
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                }
          }
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Composant pour les compteurs animés au scroll
 */
export function ViewportCounter({
  targetValue,
  duration = 2000,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  suffix = '',
  prefix = '',
}: {
  targetValue: number
  duration?: number
  className?: string
  threshold?: number
  rootMargin?: string
  suffix?: string
  prefix?: string
}) {
  const { ref, isInView, count, hasCompleted } = useViewportCounter(
    targetValue,
    duration,
    {
      threshold,
      rootMargin,
    }
  )

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
            }
          : {
              opacity: 0,
              scale: 0.8,
            }
      }
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {prefix}
      {hasCompleted ? targetValue.toLocaleString() : count.toLocaleString()}
      {suffix}
    </motion.div>
  )
}

/**
 * Composant alternatif pour les compteurs animés au scroll (version simplifiée)
 */
export function SimpleViewportCounter({
  targetValue,
  duration = 2000,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  suffix = '',
  prefix = '',
}: {
  targetValue: number
  duration?: number
  className?: string
  threshold?: number
  rootMargin?: string
  suffix?: string
  prefix?: string
}) {
  const { ref, isInView } = useViewportAnimation({ threshold, rootMargin })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration / 1000,
  })
  const displayValue = useTransform(springValue, (value) => Math.round(value))

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue)
    } else {
      motionValue.set(0)
    }
  }, [isInView, targetValue, motionValue])

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
            }
          : {
              opacity: 0,
              scale: 0.8,
            }
      }
      transition={{
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.div>
  )
}

/**
 * Composant pour les animations de fade au scroll
 */
export function ViewportFade({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
}: ViewportAnimationProps) {
  const { ref, isInView } = useViewportAnimation({ delay, threshold, rootMargin })

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
            }
          : {
              opacity: 0,
            }
      }
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Composant pour les animations de slide au scroll
 */
export function ViewportSlide({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  direction = 'up',
  distance = 100,
}: ViewportAnimationProps & {
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  const { ref, isInView } = useViewportAnimation({ delay, threshold, rootMargin })

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
  }

  const initialTransform = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{
        ...initialTransform,
        opacity: 0,
      }}
      animate={
        isInView
          ? {
              x: 0,
              y: 0,
              opacity: 1,
            }
          : {
              ...initialTransform,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
