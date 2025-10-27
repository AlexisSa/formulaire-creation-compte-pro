import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepNumber: number) => void
  className?: string
}

/**
 * Composant Stepper pour afficher la progression dans un formulaire multi-étapes
 */
export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <nav aria-label="Progress">
        <ol role="list" className="flex items-start justify-between gap-2 sm:gap-4">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = currentStep > stepNumber
            const isCurrent = currentStep === stepNumber
            const isUpcoming = currentStep < stepNumber

            const canClick = isCompleted || isCurrent
            const handleClick = () => {
              if (canClick && onStepClick) {
                onStepClick(stepNumber)
              }
            }

            return (
              <motion.li
                key={step.id}
                className={cn('relative flex-1 flex flex-col items-center')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
              >
                {/* Ligne de connexion */}
                {index !== steps.length - 1 && (
                  <div
                    className="absolute left-1/2 top-4 h-[2px] w-full -translate-y-1/2"
                    aria-hidden="true"
                  >
                    <motion.div
                      className={cn(
                        'h-full transition-all duration-200',
                        isCompleted
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                          : 'bg-gray-200'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={handleClick}
                  disabled={!canClick}
                  className={cn(
                    'group relative flex flex-col items-center text-center transition-opacity',
                    canClick && 'cursor-pointer hover:opacity-80',
                    !canClick && 'cursor-not-allowed opacity-50'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.title} - Étape ${stepNumber}`}
                >
                  <span className="flex items-center mb-1.5">
                    <motion.span
                      className={cn(
                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200',
                        isCompleted &&
                          'border-transparent bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm',
                        isCurrent && 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm',
                        isUpcoming && 'border-gray-300 bg-white text-gray-400'
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7, delay: index * 0.15 }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                        >
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <span className="text-xs font-bold">{stepNumber}</span>
                      )}
                    </motion.span>
                  </span>
                  <span className="flex min-w-0 flex-col items-center">
                    <motion.span
                      className={cn(
                        'text-xs font-semibold',
                        isCurrent && 'text-blue-600',
                        isCompleted && 'text-gray-700 group-hover:text-blue-600',
                        isUpcoming && 'text-gray-400'
                      )}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                    >
                      {step.title}
                    </motion.span>
                    {step.description && (
                      <motion.span
                        className={cn(
                          'text-xs mt-0.5 hidden sm:block',
                          isCurrent && 'text-blue-500',
                          isCompleted && 'group-hover:text-blue-500',
                          isUpcoming && 'text-gray-400'
                        )}
                        style={{
                          color: isCompleted && !isCurrent ? '#57565B' : undefined,
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
                      >
                        {step.description}
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              </motion.li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
