import { useState, useEffect, useCallback, useRef } from 'react'
import type { EntrepriseSearchResult } from '@/types/insee'

interface UseInseeSearchOptions {
  debounceMs?: number
  minLength?: number
}

export interface UseInseeSearchReturn {
  // État
  results: EntrepriseSearchResult[]
  isLoading: boolean
  error: string | null
  showResults: boolean
  selectedIndex: number
  selectedEntreprise: EntrepriseSearchResult | null

  // Actions
  search: (name: string, postalCode?: string) => Promise<void>
  selectEntreprise: (entreprise: EntrepriseSearchResult) => void
  reset: () => void
  setSelectedIndex: (index: number) => void

  // Navigation clavier
  handleKeyDown: (e: React.KeyboardEvent) => void
}

/**
 * Hook personnalisé pour la recherche d'entreprises via l'API INSEE
 * Gère le debounce, la validation, et l'état de la recherche
 */
export function useInseeSearch(
  options: UseInseeSearchOptions = {}
): UseInseeSearchReturn {
  const { debounceMs = 300, minLength = 2 } = options

  // État local
  const [results, setResults] = useState<EntrepriseSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedEntreprise, setSelectedEntreprise] =
    useState<EntrepriseSearchResult | null>(null)

  // Refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const currentSearchRef = useRef<string>('')

  /**
   * Fonction de recherche avec validation et gestion d'erreurs
   */
  const performSearch = useCallback(
    async (name: string, postalCode?: string) => {
      const searchName = name.trim()
      currentSearchRef.current = searchName

      // Validation minimale
      if (searchName.length < minLength) {
        setResults([])
        setShowResults(false)
        setError(null)
        return
      }

      // Validation du code postal
      if (postalCode && postalCode.trim().length > 0 && postalCode.trim().length !== 5) {
        setError('Le code postal doit contenir 5 chiffres')
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Construction des paramètres de recherche
        const params = new URLSearchParams({ name: searchName })
        if (postalCode && postalCode.trim().length === 5) {
          params.append('postalCode', postalCode.trim())
        }

        const response = await fetch(`/api/insee/search?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur lors de la recherche')
        }

        const data = await response.json()
        const searchResults = data.results || []

        // Vérifier que la recherche n'a pas été annulée par une nouvelle recherche
        if (currentSearchRef.current !== searchName) {
          return
        }

        setResults(searchResults)
        setShowResults(true)
        setSelectedIndex(-1)

        if (searchResults.length === 0) {
          setError(
            `Aucune entreprise trouvée pour "${searchName}". Essayez de taper plus de caractères ou vérifiez l'orthographe.`
          )
        }
      } catch (err) {
        // Vérifier que la recherche n'a pas été annulée
        if (currentSearchRef.current !== searchName) {
          return
        }

        // Messages d'erreur contextuels
        let errorMessage = 'Une erreur est survenue lors de la recherche'

        if (err instanceof Error) {
          if (err.message.includes('401')) {
            errorMessage =
              "Problème d'authentification avec l'API INSEE. Veuillez contacter le support."
          } else if (err.message.includes('429')) {
            errorMessage =
              'Trop de requêtes. Veuillez patienter quelques instants avant de réessayer.'
          } else if (err.message.includes('timeout')) {
            errorMessage = "Délai d'attente dépassé. Veuillez réessayer."
          } else if (
            err.message.includes('NetworkError') ||
            err.message.includes('fetch')
          ) {
            errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.'
          } else {
            errorMessage = `Erreur : ${err.message}`
          }
        }

        setError(errorMessage)
        setResults([])
        setShowResults(false)
      } finally {
        setIsLoading(false)
      }
    },
    [minLength]
  )

  /**
   * Fonction de recherche avec debounce
   */
  const search = useCallback(
    (name: string, postalCode?: string) => {
      // Annuler la recherche précédente
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      return new Promise<void>((resolve) => {
        debounceTimer.current = setTimeout(async () => {
          await performSearch(name, postalCode)
          resolve()
        }, debounceMs)
      })
    },
    [performSearch, debounceMs]
  )

  /**
   * Sélection d'une entreprise
   */
  const selectEntreprise = useCallback((entreprise: EntrepriseSearchResult) => {
    setSelectedEntreprise(entreprise)
    setShowResults(false)
    setResults([])
    setError(null)
    setSelectedIndex(-1)
  }, [])

  /**
   * Réinitialisation de la recherche
   */
  const reset = useCallback(() => {
    setResults([])
    setError(null)
    setShowResults(false)
    setSelectedIndex(-1)
    setSelectedEntreprise(null)
    currentSearchRef.current = ''

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
  }, [])

  /**
   * Gestion de la navigation au clavier
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || results.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            selectEntreprise(results[selectedIndex])
          }
          break
        case 'Escape':
          setShowResults(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showResults, results, selectedIndex, selectEntreprise]
  )

  // Nettoyage du timer au démontage
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    // État
    results,
    isLoading,
    error,
    showResults,
    selectedIndex,
    selectedEntreprise,

    // Actions
    search,
    selectEntreprise,
    reset,
    setSelectedIndex,

    // Navigation
    handleKeyDown,
  }
}
