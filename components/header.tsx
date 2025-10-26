'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

interface HeaderProps {
  onBack?: () => void
  onLogoClick?: () => void
}

export function Header({ onBack, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onLogoClick}
            className="hover:opacity-80 transition-opacity duration-300"
          >
            <Image
              src="/xeilom-logo.png"
              alt="Xeilom - Distributeur et fabricant courant faible"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </button>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-2 rounded-lg transition-all duration-300"
              onClick={() => {
                const link = document.createElement('a')
                link.href = 'https://www.xeilom.fr'
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                link.click()
              }}
            >
              <ShoppingBag className="h-4 w-4" />
              Notre boutique
            </Button>
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-2 rounded-lg transition-all duration-300"
              >
                Retour à l&apos;accueil
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
