'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSecureForm } from '@/contexts/CSRFContext'
import { ValidationUtils } from '@/lib/security'

interface UseSecureCompanyFormOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
  autoSave?: boolean
  autoSaveDelay?: number
}

interface UseSecureCompanyFormReturn {
  submitForm: (data: any) => Promise<void>
  loadData: (companyId: string) => Promise<any>
  isLoading: boolean
  error: string | null
  isReady: boolean
  validateData: (data: any) => { isValid: boolean; errors: string[] }
  autoSaveData: (data: any) => void
}

/**
 * Hook pour gérer les formulaires d'entreprise de manière sécurisée
 */
export function useSecureCompanyForm(
  options: UseSecureCompanyFormOptions = {}
): UseSecureCompanyFormReturn {
  const { onSuccess, onError, autoSave = false, autoSaveDelay = 2000 } = options
  const { submitSecureForm, validateToken, isReady } = useSecureForm()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  /**
   * Valide les données du formulaire
   */
  const validateData = useCallback(
    (data: any): { isValid: boolean; errors: string[] } => {
      try {
        ValidationUtils.validateCompanyData(data)
        return { isValid: true, errors: [] }
      } catch (error) {
        const errors = error instanceof Error ? [error.message] : ['Erreur de validation']
        return { isValid: false, errors }
      }
    },
    []
  )

  /**
   * Soumet le formulaire de manière sécurisée
   */
  const submitForm = useCallback(
    async (data: any) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Valider les données côté client
        const validation = validateData(data)
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '))
        }

        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Soumettre les données
        const response = await submitSecureForm('/api/secure/company', data)
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors de la sauvegarde')
        }

        // Succès
        onSuccess?.(result.data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateData, validateToken, submitSecureForm, onSuccess, onError]
  )

  /**
   * Charge les données d'une entreprise
   */
  const loadData = useCallback(
    async (companyId: string) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Charger les données
        const response = await submitSecureForm(
          `/api/secure/company?id=${companyId}`,
          {},
          { method: 'GET' }
        )
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors du chargement')
        }

        return result.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateToken, submitSecureForm, onError]
  )

  /**
   * Auto-sauvegarde avec debounce
   */
  useEffect(() => {
    if (!autoSave) return

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [autoSave, autoSaveTimer])

  /**
   * Fonction d'auto-sauvegarde
   */
  const autoSaveData = useCallback(
    async (data: any) => {
      if (!autoSave || !isReady) return

      // Annuler la sauvegarde précédente
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }

      // Programmer une nouvelle sauvegarde
      const timer = setTimeout(async () => {
        try {
          const validation = validateData(data)
          if (validation.isValid) {
            await submitForm(data)
          }
        } catch (error) {
          console.warn('Auto-sauvegarde échouée:', error)
        }
      }, autoSaveDelay)

      setAutoSaveTimer(timer)
    },
    [autoSave, isReady, autoSaveDelay, validateData, submitForm, autoSaveTimer]
  )

  return {
    submitForm,
    loadData,
    isLoading,
    error,
    isReady,
    validateData,
    autoSaveData,
  }
}

/**
 * Hook pour les données de contact sécurisées
 */
export function useSecureContactForm(
  options: UseSecureCompanyFormOptions = {}
): UseSecureCompanyFormReturn {
  const { onSuccess, onError, autoSave = false, autoSaveDelay = 2000 } = options
  const { submitSecureForm, validateToken, isReady } = useSecureForm()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Valide les données de contact
   */
  const validateData = useCallback(
    (data: any): { isValid: boolean; errors: string[] } => {
      try {
        ValidationUtils.validateContactData(data)
        return { isValid: true, errors: [] }
      } catch (error) {
        const errors = error instanceof Error ? [error.message] : ['Erreur de validation']
        return { isValid: false, errors }
      }
    },
    []
  )

  /**
   * Soumet les données de contact
   */
  const submitForm = useCallback(
    async (data: any) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Valider les données
        const validation = validateData(data)
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '))
        }

        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Soumettre les données
        const response = await submitSecureForm('/api/secure/contact', data)
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors de la sauvegarde')
        }

        onSuccess?.(result.data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateData, validateToken, submitSecureForm, onSuccess, onError]
  )

  /**
   * Charge les données de contact
   */
  const loadData = useCallback(
    async (contactId: string) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Charger les données
        const response = await submitSecureForm(
          `/api/secure/contact?id=${contactId}`,
          {},
          { method: 'GET' }
        )
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors du chargement')
        }

        return result.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateToken, submitSecureForm, onError]
  )

  return {
    submitForm,
    loadData,
    isLoading,
    error,
    isReady,
    validateData,
    autoSaveData: () => {}, // Pas d'auto-save pour les contacts
  }
}

/**
 * Hook pour les fichiers sécurisés
 */
export function useSecureFileUpload(
  options: UseSecureCompanyFormOptions = {}
): UseSecureCompanyFormReturn {
  const { onSuccess, onError } = options
  const { submitSecureForm, validateToken, isReady } = useSecureForm()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Valide les données de fichier
   */
  const validateData = useCallback(
    (data: any): { isValid: boolean; errors: string[] } => {
      try {
        ValidationUtils.validateFileData(data)
        return { isValid: true, errors: [] }
      } catch (error) {
        const errors = error instanceof Error ? [error.message] : ['Erreur de validation']
        return { isValid: false, errors }
      }
    },
    []
  )

  /**
   * Upload un fichier de manière sécurisée
   */
  const submitForm = useCallback(
    async (fileData: any) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Valider les données de fichier
        const validation = validateData(fileData)
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '))
        }

        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Upload le fichier
        const response = await submitSecureForm('/api/secure/upload', fileData)
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || "Erreur lors de l'upload")
        }

        onSuccess?.(result.data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateData, validateToken, submitSecureForm, onSuccess, onError]
  )

  /**
   * Charge les informations d'un fichier
   */
  const loadData = useCallback(
    async (fileId: string) => {
      if (!isReady) {
        throw new Error('Système de sécurité non initialisé')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Vérifier le token CSRF
        const isTokenValid = await validateToken()
        if (!isTokenValid) {
          throw new Error('Token de sécurité expiré. Veuillez recharger la page.')
        }

        // Charger les informations du fichier
        const response = await submitSecureForm(
          `/api/secure/upload?id=${fileId}`,
          {},
          { method: 'GET' }
        )
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || 'Erreur lors du chargement')
        }

        return result.data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [isReady, validateToken, submitSecureForm, onError]
  )

  return {
    submitForm,
    loadData,
    isLoading,
    error,
    isReady,
    validateData,
    autoSaveData: () => {}, // Pas d'auto-save pour les contacts
  }
}
