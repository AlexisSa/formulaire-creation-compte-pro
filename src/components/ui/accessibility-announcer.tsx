'use client'

import { useEffect, useState } from 'react'

interface AccessibilityAnnouncerProps {
  message: string
  priority?: 'polite' | 'assertive'
  delay?: number
}

/**
 * Composant pour annoncer des messages aux lecteurs d'écran
 * Utilisé pour les changements d'état importants
 */
export function AccessibilityAnnouncer({
  message,
  priority = 'polite',
  delay = 0,
}: AccessibilityAnnouncerProps) {
  const [shouldAnnounce, setShouldAnnounce] = useState(false)

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setShouldAnnounce(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [message, delay])

  useEffect(() => {
    if (shouldAnnounce) {
      setShouldAnnounce(false)
    }
  }, [shouldAnnounce])

  if (!shouldAnnounce || !message) return null

  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only" role="status">
      {message}
    </div>
  )
}

/**
 * Hook pour gérer les annonces d'accessibilité
 */
export function useAccessibilityAnnouncer() {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite')

  const announce = (
    newMessage: string,
    newPriority: 'polite' | 'assertive' = 'polite'
  ) => {
    setPriority(newPriority)
    setMessage(newMessage)
  }

  return {
    announce,
    announcer: <AccessibilityAnnouncer message={message} priority={priority} />,
  }
}
