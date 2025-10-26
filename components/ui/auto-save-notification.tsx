'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutoSaveNotificationProps {
  isVisible: boolean
  message?: string
  className?: string
}

/**
 * Composant de notification pour la sauvegarde automatique
 * Affiche un message discret quand les données sont sauvegardées
 */
export function AutoSaveNotification({
  isVisible,
  message = 'Brouillon sauvegardé',
  className,
}: AutoSaveNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShow(true)

      // Masquer automatiquement après 2 secondes
      const timer = setTimeout(() => {
        setShow(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'fixed bottom-4 right-4 z-50',
            'bg-white/90 backdrop-blur-sm border border-green-200',
            'rounded-lg shadow-lg px-4 py-3',
            'flex items-center space-x-2',
            'text-sm text-green-700',
            className
          )}
        >
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface SaveIndicatorProps {
  isSaving: boolean
  className?: string
}

/**
 * Indicateur de sauvegarde en cours
 * Affiche un spinner discret pendant la sauvegarde
 */
export function SaveIndicator({ isSaving, className }: SaveIndicatorProps) {
  return (
    <AnimatePresence>
      {isSaving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed top-4 right-4 z-50',
            'bg-white/90 backdrop-blur-sm border border-blue-200',
            'rounded-lg shadow-sm px-3 py-2',
            'flex items-center space-x-2',
            'text-sm text-blue-700',
            className
          )}
        >
          <Save className="w-4 h-4 text-blue-500 animate-spin" />
          <span className="font-medium">Sauvegarde...</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
