'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScrollableTableProps {
  children: React.ReactNode
  className?: string
  showScrollButtons?: boolean
}

/**
 * Composant de table scrollable horizontalement pour mobile
 * Optimisé pour les écrans en mode paysage
 */
export function ScrollableTable({
  children,
  className,
  showScrollButtons = true,
}: ScrollableTableProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const checkScrollability = React.useCallback(() => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  React.useEffect(() => {
    checkScrollability()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScrollability)
      }
      window.removeEventListener('resize', checkScrollability)
    }
  }, [checkScrollability])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative">
      {/* Bouton gauche */}
      {showScrollButtons && canScrollLeft && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
          aria-label="Faire défiler vers la gauche"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* Bouton droit */}
      {showScrollButtons && canScrollRight && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50"
          aria-label="Faire défiler vers la droite"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Zone scrollable */}
      <div
        ref={scrollRef}
        className={cn(
          'overflow-x-auto',
          'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
          // Amélioration du scroll pour mobile
          'overscroll-x-contain',
          className
        )}
        style={{
          // Smooth scrolling pour iOS
          WebkitOverflowScrolling: 'touch',
          // Masquer la scrollbar sur certains navigateurs
          scrollbarWidth: 'thin',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Styles et utilitaires pour les tables responsive
 */
export const tableStyles = {
  container: 'min-w-full divide-y divide-gray-200',
  header: 'bg-gray-50',
  headerCell:
    'px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider',
  body: 'bg-white divide-y divide-gray-200',
  cell: 'px-4 py-3 text-sm text-gray-900',
  mobileCell: 'block sm:table-cell',
  mobileLabel: 'block font-medium text-gray-500 sm:hidden',
}
