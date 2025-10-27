'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ViewportAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  rootMargin?: string
}

/**
 * Hook simple pour détecter quand un élément est visible
 */
function useInView(
  options: { threshold?: number; rootMargin?: string; triggerOnce?: boolean } = {}
) {
  const { threshold = 0.3, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasTriggered) {
            setIsInView(true)
            if (triggerOnce) {
              setHasTriggered(true)
            }
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref, isInView: triggerOnce ? hasTriggered : isInView }
}

/**
 * Composant de compteur animé simple et robuste
 */
export function AnimatedCounter({
  targetValue,
  duration = 2000,
  className,
  threshold = 0.3,
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
  const { ref, isInView } = useInView({ threshold, rootMargin, triggerOnce: true })
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
 * Composant pour les animations de révélation au scroll
 */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.3,
  rootMargin = '0px',
  direction = 'up',
  distance = 50,
}: ViewportAnimationProps & {
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  const { ref, isInView } = useInView({ threshold, rootMargin, triggerOnce: true })

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

/**
 * Composant pour les animations en cascade au scroll
 */
export function StaggerOnScroll({
  children,
  className,
  staggerDelay = 100,
  threshold = 0.3,
  rootMargin = '0px',
}: ViewportAnimationProps & {
  staggerDelay?: number
}) {
  const childrenArray = Array.isArray(children) ? children : [children]
  const { ref, isInView } = useInView({ threshold, rootMargin, triggerOnce: true })
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    if (isInView && visibleItems.length === 0) {
      for (let i = 0; i < childrenArray.length; i++) {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, i])
        }, i * staggerDelay)
      }
    }
  }, [isInView, childrenArray.length, staggerDelay, visibleItems.length])

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
 * Composant pour les animations de fade au scroll
 */
export function FadeOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.3,
  rootMargin = '0px',
}: ViewportAnimationProps) {
  const { ref, isInView } = useInView({ threshold, rootMargin, triggerOnce: true })

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
