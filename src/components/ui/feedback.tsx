'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useToast, type Toast } from '@/contexts/ToastContext'

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  className?: string
}

/**
 * Composant de toast avec animations fluides
 */
export function Toast({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  className,
}: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'relative overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        colors[type],
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColors[type])} />
        <div className="flex-1 min-w-0">
          <motion.h3
            className="text-sm font-medium"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
          {message && (
            <motion.p
              className="mt-1 text-sm opacity-90"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Barre de progression */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
    </motion.div>
  )
}

/**
 * Container pour les toasts avec gestion de la position
 */
export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  )
}

/**
 * Composant qui affiche tous les toasts du contexte
 */
export function ToastList() {
  const { toasts, removeToast } = useToast()

  return (
    <ToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  )
}

/**
 * Composant de notification de sauvegarde
 */
export function SaveNotification({
  isVisible,
  isSaving = false,
  onClose,
}: {
  isVisible: boolean
  isSaving?: boolean
  onClose?: () => void
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
            <div className="flex items-center space-x-3">
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isSaving ? 'Sauvegarde en cours...' : 'Sauvegardé automatiquement'}
              </span>
              {onClose && (
                <button
                  onClick={onClose}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Composant de feedback pour les interactions
 */
export function InteractionFeedback({
  children,
  feedback,
  className,
}: {
  children: ReactNode
  feedback?: 'success' | 'error' | 'loading'
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      {children}

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {feedback === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}
            {feedback === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}
            {feedback === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
