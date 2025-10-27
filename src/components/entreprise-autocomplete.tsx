'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, Building2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccessibility } from '@/hooks/useAccessibility'
import { AccessibilityAnnouncer } from '@/components/ui/accessibility-announcer'
import type { EntrepriseSearchResult } from '@/types/insee'
import { cn } from '@/lib/utils'
import { useInseeSearch } from '@/hooks'

interface EntrepriseAutocompleteProps {
  onSelect: (entreprise: EntrepriseSearchResult) => void
  className?: string
  label?: string
  required?: boolean
  error?: string
}

/**
 * Composant d'autocomplete pour rechercher une entreprise via l'API INSEE
 */
export function EntrepriseAutocomplete({
  onSelect,
  className,
  label = 'Rechercher une entreprise',
  required = false,
  error,
}: EntrepriseAutocompleteProps) {
  const [searchName, setSearchName] = useState('')
  const [searchPostal, setSearchPostal] = useState('')
  const [selectedEntreprise, setSelectedEntreprise] =
    useState<EntrepriseSearchResult | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const resultsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Hook d'accessibilité
  const { announceToScreenReader } = useAccessibility()

  // Utilisation du hook personnalisé pour la logique de recherche
  const {
    results,
    isLoading,
    error: searchError,
    showResults,
    selectedIndex,
    search,
    selectEntreprise: selectFromHook,
    reset,
    setSelectedIndex,
    handleKeyDown,
  } = useInseeSearch({
    debounceMs: 300,
    minLength: 2,
  })

  /**
   * Gestion du debounce avec le hook personnalisé
   */
  useEffect(() => {
    search(searchName, searchPostal)
  }, [searchName, searchPostal, search])

  /**
   * Annonces d'accessibilité pour les changements d'état
   */
  useEffect(() => {
    if (isLoading) {
      setAnnouncement('Recherche en cours...')
    } else if (searchError) {
      setAnnouncement(`Erreur de recherche: ${searchError}`)
    } else if (results.length > 0) {
      setAnnouncement(
        `${results.length} entreprise${results.length > 1 ? 's' : ''} trouvée${
          results.length > 1 ? 's' : ''
        }`
      )
    } else if (searchName.length >= 2 && !isLoading) {
      setAnnouncement('Aucune entreprise trouvée')
    }
  }, [isLoading, searchError, results.length, searchName.length])

  /**
   * Annonce les changements de sélection
   */
  useEffect(() => {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      const selected = results[selectedIndex]
      announceToScreenReader(
        `${selectedIndex + 1} sur ${results.length}: ${selected.raisonSociale}`
      )
    }
  }, [selectedIndex, results, announceToScreenReader])

  /**
   * Gestion de la sélection d'une entreprise
   */
  const handleSelect = (entreprise: EntrepriseSearchResult) => {
    onSelect(entreprise)
    setSelectedEntreprise(entreprise)
    selectFromHook(entreprise)

    // Annonce la sélection
    announceToScreenReader(`Entreprise sélectionnée: ${entreprise.raisonSociale}`)
  }

  /**
   * Réinitialiser la recherche
   */
  const handleReset = () => {
    setSearchName('')
    setSearchPostal('')
    setSelectedEntreprise(null)
    reset()

    // Annonce la réinitialisation
    announceToScreenReader('Recherche réinitialisée')

    // Remet le focus sur l'input
    inputRef.current?.focus()
  }

  /**
   * Gestion de la navigation au clavier (déléguée au hook)
   */
  const onKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e)

    // Gestion spécifique pour Enter sur les résultats
    if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelect(results[selectedIndex])
    }
  }

  /**
   * Fermeture des résultats au clic extérieur
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        // Le hook gère déjà la fermeture via handleKeyDown avec Escape
        // On peut utiliser reset() pour fermer les résultats
        if (showResults) {
          reset()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showResults, reset])

  return (
    <div className={cn('space-y-3', className)} ref={resultsRef}>
      {/* Annonceur d'accessibilité */}
      <AccessibilityAnnouncer message={announcement} priority="polite" />

      {/* Message de succès */}
      {selectedEntreprise && (
        <div
          className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-lg p-4 space-y-2 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  Entreprise sélectionnée !
                </p>
                <p className="text-sm text-green-700 mt-1 font-semibold">
                  {selectedEntreprise.raisonSociale}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  SIRET: {selectedEntreprise.siret} • NAF:{' '}
                  {selectedEntreprise.nafApe || 'Non disponible'}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {selectedEntreprise.adresse.codePostal}{' '}
                  {selectedEntreprise.adresse.ville}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex-shrink-0 text-green-700 hover:text-green-900 text-sm font-medium underline ml-4"
              aria-label="Changer d'entreprise"
            >
              Changer
            </button>
          </div>
        </div>
      )}

      {/* Formulaire de recherche */}
      {!selectedEntreprise && (
        <div className="space-y-4">
          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search-compagnyName" className="text-sm">
                  Nom de l&apos;entreprise <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="search-name"
                    type="text"
                    placeholder="Tapez le nom de l'entreprise..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="pr-10"
                    aria-label="Nom de l'entreprise à rechercher"
                    aria-describedby={error ? 'search-error' : undefined}
                  />
                  {isLoading && (
                    <Loader2
                      className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              <div className="w-32 space-y-2">
                <Label htmlFor="search-postal" className="text-sm">
                  Code postal
                </Label>
                <Input
                  id="search-postal"
                  type="text"
                  placeholder="75001"
                  value={searchPostal}
                  onChange={(e) => setSearchPostal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={5}
                  aria-label="Code postal de l'entreprise (optionnel)"
                />
              </div>
            </div>

            {/* Résultats en position absolue */}
            {showResults && results.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 z-[100] border rounded-lg bg-white/95 backdrop-blur-sm shadow-xl max-h-96 overflow-auto"
                role="listbox"
                aria-label="Résultats de recherche d'entreprises"
                aria-expanded="true"
              >
                <div className="p-2 bg-blue-50/80 backdrop-blur-sm border-b border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">
                    ✓ {results.length} résultat{results.length > 1 ? 's' : ''} trouvé
                    {results.length > 1 ? 's' : ''}
                  </p>
                </div>
                {results.map((entreprise, index) => (
                  <button
                    key={entreprise.siret}
                    type="button"
                    onClick={() => handleSelect(entreprise)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-accent transition-colors',
                      'border-b last:border-b-0 focus:outline-none focus:bg-accent',
                      selectedIndex === index && 'bg-accent'
                    )}
                    role="option"
                    aria-selected={selectedIndex === index}
                    tabIndex={-1}
                  >
                    <div className="flex items-start space-x-3">
                      <Building2
                        className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {entreprise.raisonSociale}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          SIRET: {entreprise.siret} • NAF: {entreprise.nafApe}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {entreprise.adresse.voie && `${entreprise.adresse.voie}, `}
                          {entreprise.adresse.codePostal} {entreprise.adresse.ville}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div
              id="search-error"
              className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Instructions */}
          {!showResults && !error && !isLoading && searchName.length === 0 && (
            <p className="text-xs text-muted-foreground italic">
              Tapez au moins 2 caractères pour lancer la recherche. Le code postal est
              optionnel mais affine les résultats.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
