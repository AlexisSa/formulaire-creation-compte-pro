import { useEffect, useCallback, useRef } from 'react'
import type { AccountFormData } from '@/lib/validation'
import type { UseFormReturn } from 'react-hook-form'

type DraftData = Partial<AccountFormData> & { _timestamp?: number }

interface UseAutoSaveOptions {
  debounceMs?: number
  storageKey?: string
  enabled?: boolean
  form?: UseFormReturn<AccountFormData>
}

export interface UseAutoSaveReturn {
  saveDraft: (data?: Partial<AccountFormData>) => void
  loadDraft: () => Partial<AccountFormData> | null
  clearDraft: () => void
  hasDraft: () => boolean
}

/**
 * Hook personnalisé pour la sauvegarde automatique en brouillon
 * Sauvegarde les données du formulaire dans localStorage avec debounce
 */
export function useAutoSave(options: UseAutoSaveOptions = {}): UseAutoSaveReturn {
  const {
    debounceMs = 1000, // 1 seconde par défaut
    storageKey = 'account-form-draft',
    enabled = true,
    form,
  } = options

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const lastSavedData = useRef<string>('')

  /**
   * Sauvegarde immédiate dans localStorage
   */
  const saveToStorage = useCallback(
    (data: Partial<AccountFormData>) => {
      // Vérifier que nous sommes côté client
      if (typeof window === 'undefined') return

      try {
        const dataString = JSON.stringify(data)

        // Éviter les sauvegardes inutiles
        if (dataString === lastSavedData.current) {
          return
        }

        localStorage.setItem(storageKey, dataString)
        lastSavedData.current = dataString
      } catch (error) {
        // Silently fail - pas de notification d'erreur en production
        if (process.env.NODE_ENV === 'development') {
          console.error('Erreur lors de la sauvegarde du brouillon:', error)
        }
      }
    },
    [storageKey]
  )

  /**
   * Sauvegarde avec debounce
   */
  const saveDraft = useCallback(
    (data?: Partial<AccountFormData>) => {
      if (!enabled) return

      // Si aucune donnée n'est fournie et qu'un formulaire est disponible, utiliser les données du formulaire
      const dataToSave = data || (form ? form.getValues() : {})

      // Ajouter un timestamp
      const dataWithTimestamp = {
        ...dataToSave,
        _timestamp: Date.now(),
      }

      // Annuler la sauvegarde précédente
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Programmer une nouvelle sauvegarde
      debounceTimer.current = setTimeout(() => {
        saveToStorage(dataWithTimestamp)
      }, debounceMs)
    },
    [enabled, debounceMs, saveToStorage, form]
  )

  /**
   * Chargement du brouillon depuis localStorage
   */
  const loadDraft = useCallback((): Partial<AccountFormData> | null => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return null

    try {
      const savedData = localStorage.getItem(storageKey)
      if (!savedData) return null

      const parsedData = JSON.parse(savedData) as DraftData

      // Vérifier que les données ne sont pas trop anciennes (optionnel)
      const dataAge = Date.now() - (parsedData._timestamp || 0)
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 jours

      if (dataAge > maxAge) {
        clearDraft()
        return null
      }

      return parsedData
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors du chargement du brouillon:', error)
      }
      return null
    }
  }, [storageKey])

  /**
   * Suppression du brouillon
   */
  const clearDraft = useCallback(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(storageKey)
      lastSavedData.current = ''

      // Annuler la sauvegarde en cours
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur lors de la suppression du brouillon:', error)
      }
    }
  }, [storageKey])

  /**
   * Vérifier s'il y a un brouillon
   */
  const hasDraft = useCallback((): boolean => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined') return false

    try {
      return localStorage.getItem(storageKey) !== null
    } catch {
      return false
    }
  }, [storageKey])

  // Sauvegarde automatique basée sur les changements du formulaire
  useEffect(() => {
    if (!form || !enabled) return

    const subscription = form.watch((data) => {
      // Sauvegarder seulement si il y a des données significatives
      const hasSignificantData = Object.values(data).some(
        (value) => value && typeof value === 'string' && value.trim().length > 0
      )

      if (hasSignificantData) {
        saveDraft(data as Partial<AccountFormData>)
      }
    })

    return () => subscription.unsubscribe()
  }, [form, enabled, saveDraft])

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  }
}
