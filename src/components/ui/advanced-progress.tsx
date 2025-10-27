'use client'

import { motion } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStep {
  id: number
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

interface AdvancedProgressProps {
  steps: ProgressStep[]
  currentStep: number
  className?: string
}

/**
 * Composant de progression avancé avec animations et états visuels
 */
export function AdvancedProgress({
  steps,
  currentStep,
  className,
}: AdvancedProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Étape */}
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                  {
                    'bg-green-500 border-green-500 text-white':
                      step.status === 'completed',
                    'bg-blue-500 border-blue-500 text-white': step.status === 'current',
                    'bg-gray-100 border-gray-300 text-gray-400':
                      step.status === 'upcoming',
                  }
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {step.status === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : step.status === 'current' ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Circle className="w-5 h-5" fill="currentColor" />
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </motion.div>

              {/* Titre et description */}
              <div className="mt-3 text-center max-w-32">
                <motion.h3
                  className={cn('text-sm font-medium transition-colors duration-300', {
                    'text-green-600': step.status === 'completed',
                    'text-blue-600': step.status === 'current',
                    'text-gray-500': step.status === 'upcoming',
                  })}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-xs text-gray-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {step.description}
                </motion.p>
              </div>
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="relative h-0.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'absolute top-0 left-0 h-full rounded-full',
                      step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    )}
                    initial={{ width: '0%' }}
                    animate={{
                      width: step.status === 'completed' ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Composant de barre de progression circulaire
 */
export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
}: {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Cercle de progression */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="text-blue-500"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </svg>

      {/* Texte au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-blue-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </div>
  )
}

/**
 * Composant de skeleton avec animation de chargement
 */
export function SkeletonLoader({
  className,
  lines = 1,
}: {
  className?: string
  lines?: number
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}
