import { useState, useEffect, useCallback } from 'react'

interface UseAnimationOptions {
  duration?: number
  delay?: number
  repeat?: boolean
  onComplete?: () => void
}

/**
 * Hook pour gérer les animations et transitions
 */
export function useAnimation(options: UseAnimationOptions = {}) {
  const { duration = 300, delay = 0, repeat = false, onComplete } = options
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true)
    setAnimationKey((prev) => prev + 1)

    const timer = setTimeout(() => {
      setIsAnimating(false)
      onComplete?.()
    }, duration + delay)

    return () => clearTimeout(timer)
  }, [duration, delay, onComplete])

  const resetAnimation = useCallback(() => {
    setIsAnimating(false)
    setAnimationKey(0)
  }, [])

  return {
    isAnimating,
    animationKey,
    triggerAnimation,
    resetAnimation,
  }
}

/**
 * Hook pour les animations de progression
 */
export function useProgressAnimation(initialProgress = 0) {
  const [progress, setProgress] = useState(initialProgress)
  const [isAnimating, setIsAnimating] = useState(false)

  const animateTo = useCallback(
    (targetProgress: number, duration = 1000) => {
      setIsAnimating(true)

      const startProgress = progress
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progressRatio = Math.min(elapsed / duration, 1)

        // Fonction d'easing (ease-out)
        const easedProgress = 1 - Math.pow(1 - progressRatio, 3)

        const currentProgress =
          startProgress + (targetProgress - startProgress) * easedProgress
        setProgress(currentProgress)

        if (progressRatio < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    },
    [progress]
  )

  return {
    progress,
    isAnimating,
    animateTo,
    setProgress,
  }
}

/**
 * Hook pour les animations de stagger (décalage)
 */
export function useStaggerAnimation(itemCount: number, staggerDelay = 100) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  const triggerStagger = useCallback(() => {
    setVisibleItems([])

    for (let i = 0; i < itemCount; i++) {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, i])
      }, i * staggerDelay)
    }
  }, [itemCount, staggerDelay])

  const resetStagger = useCallback(() => {
    setVisibleItems([])
  }, [])

  return {
    visibleItems,
    triggerStagger,
    resetStagger,
  }
}

/**
 * Hook pour les animations de particules
 */
export function useParticleAnimation() {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      life: number
    }>
  >([])

  const createParticles = useCallback((count: number, x: number, y: number) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
    }))

    setParticles((prev) => [...prev, ...newParticles])
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02,
          }))
          .filter((particle) => particle.life > 0)
      )
    }, 16) // 60 FPS

    return () => clearInterval(interval)
  }, [particles.length])

  return {
    particles,
    createParticles,
    clearParticles: () => setParticles([]),
  }
}

/**
 * Hook pour les animations de morphing
 */
export function useMorphAnimation() {
  const [morphKey, setMorphKey] = useState(0)
  const [isMorphing, setIsMorphing] = useState(false)

  const triggerMorph = useCallback((duration = 500) => {
    setIsMorphing(true)
    setMorphKey((prev) => prev + 1)

    setTimeout(() => {
      setIsMorphing(false)
    }, duration)
  }, [])

  return {
    morphKey,
    isMorphing,
    triggerMorph,
  }
}
