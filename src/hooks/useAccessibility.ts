import { useEffect, useRef, useCallback } from 'react'

interface UseAccessibilityOptions {
  announceChanges?: boolean
  manageFocus?: boolean
  enableFocusTrap?: boolean
}

interface UseAccessibilityReturn {
  announceToScreenReader: (message: string) => void
  trapFocus: (element: HTMLElement) => void
  releaseFocus: () => void
  focusFirstElement: (container: HTMLElement) => void
  focusLastElement: (container: HTMLElement) => void
  getFocusableElements: (container: HTMLElement) => HTMLElement[]
}

/**
 * Hook personnalisé pour gérer l'accessibilité
 * Fournit des utilitaires pour les lecteurs d'écran et la navigation clavier
 */
export function useAccessibility(
  options: UseAccessibilityOptions = {}
): UseAccessibilityReturn {
  const { announceChanges = true, manageFocus = true, enableFocusTrap = false } = options

  const focusTrapRef = useRef<HTMLElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  /**
   * Annonce un message aux lecteurs d'écran
   */
  const announceToScreenReader = useCallback(
    (message: string) => {
      if (!announceChanges || typeof window === 'undefined') return

      // Créer un élément temporaire pour l'annonce
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', 'polite')
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message

      document.body.appendChild(announcement)

      // Supprimer l'élément après l'annonce
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    },
    [announceChanges]
  )

  /**
   * Obtient tous les éléments focusables dans un conteneur
   */
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }, [])

  /**
   * Focus sur le premier élément focusable
   */
  const focusFirstElement = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container)
      if (focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    },
    [getFocusableElements]
  )

  /**
   * Focus sur le dernier élément focusable
   */
  const focusLastElement = useCallback(
    (container: HTMLElement) => {
      const focusableElements = getFocusableElements(container)
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus()
      }
    },
    [getFocusableElements]
  )

  /**
   * Piège le focus dans un élément
   */
  const trapFocus = useCallback(
    (element: HTMLElement) => {
      if (!manageFocus || !enableFocusTrap) return

      focusTrapRef.current = element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus sur le premier élément focusable
      focusFirstElement(element)

      // Gérer la navigation clavier
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = getFocusableElements(element)
          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (e.shiftKey) {
            // Shift + Tab : aller au dernier élément si on est sur le premier
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            // Tab : aller au premier élément si on est sur le dernier
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }

        if (e.key === 'Escape') {
          releaseFocus()
        }
      }

      element.addEventListener('keydown', handleKeyDown)
      return () => element.removeEventListener('keydown', handleKeyDown)
    },
    [manageFocus, enableFocusTrap, focusFirstElement, getFocusableElements]
  )

  /**
   * Libère le piège de focus
   */
  const releaseFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
    focusTrapRef.current = null
  }, [])

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      releaseFocus()
    }
  }, [releaseFocus])

  return {
    announceToScreenReader,
    trapFocus,
    releaseFocus,
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  }
}
