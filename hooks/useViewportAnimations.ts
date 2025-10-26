'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import React from 'react'

interface UseViewportAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

interface UseViewportAnimationReturn {
  ref: React.RefObject<HTMLDivElement>
  isInView: boolean
  hasAnimated: boolean
}

/**
 * Hook pour déclencher des animations quand un élément entre dans le viewport
 * Se déclenche une seule fois par défaut
 */
export function useViewportAnimation(
  options: UseViewportAnimationOptions = {}
): UseViewportAnimationReturn {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, delay = 0 } = options

  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true)
              if (triggerOnce) {
                setHasAnimated(true)
              }
            }, delay)
          } else {
            setIsInView(true)
            if (triggerOnce) {
              setHasAnimated(true)
            }
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, delay])

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isInView: triggerOnce ? hasAnimated : isInView,
    hasAnimated,
  }
}

/**
 * Hook pour les animations en cascade au scroll
 */
export function useViewportStagger(
  itemCount: number,
  staggerDelay = 100,
  options: UseViewportAnimationOptions = {}
) {
  const { ref, isInView, hasAnimated } = useViewportAnimation(options)
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    // Ne lancer l'animation que si l'élément est visible ET qu'elle n'a pas encore été lancée
    if (isInView && !hasStarted && visibleItems.length === 0) {
      setHasStarted(true)
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setVisibleItems((prev) => [...prev, i])
        }, i * staggerDelay)
      }
    }
  }, [isInView, itemCount, staggerDelay, visibleItems.length, hasStarted])

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isInView,
    visibleItems,
    hasStarted,
  }
}

/**
 * Hook pour les compteurs animés au scroll
 */
export function useViewportCounter(
  targetValue: number,
  duration = 2000,
  options: UseViewportAnimationOptions = {}
) {
  const { ref, isInView, hasAnimated } = useViewportAnimation(options)
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    // Ne lancer l'animation que si l'élément est visible ET qu'elle n'a pas encore été complétée
    if (isInView && !isAnimating && !hasCompleted) {
      setIsAnimating(true)
      const startTime = Date.now()
      const startValue = 0

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)

        const currentValue = Math.floor(
          startValue + (targetValue - startValue) * easedProgress
        )
        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(targetValue)
          setIsAnimating(false)
          setHasCompleted(true) // Marquer comme complétée pour éviter les relances
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, targetValue, duration, isAnimating, hasCompleted])

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isInView,
    count,
    isAnimating,
    hasCompleted,
  }
}

/**
 * Hook pour les animations de révélation au scroll
 */
export function useViewportReveal(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance = 50,
  options: UseViewportAnimationOptions = {}
) {
  const { ref, isInView } = useViewportAnimation(options)

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { y: 0, x: distance },
    right: { y: 0, x: -distance },
  }

  const initialTransform = directionMap[direction]

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isInView,
    initialTransform,
    animateTransform: { x: 0, y: 0 },
  }
}

/**
 * Hook pour les animations de scale au scroll
 */
export function useViewportScale(
  initialScale = 0.8,
  targetScale = 1,
  options: UseViewportAnimationOptions = {}
) {
  const { ref, isInView } = useViewportAnimation(options)

  return {
    ref: ref as React.RefObject<HTMLDivElement>,
    isInView,
    initialScale: isInView ? targetScale : initialScale,
    animateScale: targetScale,
  }
}
