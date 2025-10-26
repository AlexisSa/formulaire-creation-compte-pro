'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { EncryptionUtils } from '@/lib/security'

interface CSRFContextType {
  token: string | null
  sessionId: string | null
  generateToken: () => Promise<void>
  verifyToken: (token: string) => boolean
  isReady: boolean
}

const CSRFContext = createContext<CSRFContextType | null>(null)

/**
 * Hook pour utiliser le contexte CSRF
 */
export function useCSRF() {
  const context = useContext(CSRFContext)
  if (!context) {
    throw new Error('useCSRF doit être utilisé dans un CSRFProvider')
  }
  return context
}

/**
 * Provider CSRF pour l'application
 */
export function CSRFProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  /**
   * Génère un nouveau token CSRF
   */
  const generateToken = useCallback(async () => {
    try {
      // Générer un ID de session unique
      const newSessionId = crypto.randomUUID()
      setSessionId(newSessionId)

      // Générer un token CSRF
      const newToken = EncryptionUtils.generateCSRFToken()
      setToken(newToken)

      // Stocker en sessionStorage pour persistance
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrf-session-id', newSessionId)
        sessionStorage.setItem('csrf-token', newToken)
      }

      // Envoyer le token au serveur pour validation
      await fetch('/api/csrf/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': newToken,
          'X-Session-ID': newSessionId,
        },
        body: JSON.stringify({
          token: newToken,
          sessionId: newSessionId,
        }),
      })
    } catch (error) {
      console.error('Erreur lors de la génération du token CSRF:', error)
    }
  }, [])

  /**
   * Vérifie un token CSRF
   */
  const verifyToken = useCallback(
    (tokenToVerify: string): boolean => {
      if (!token || !sessionId) return false
      return EncryptionUtils.verifyCSRFToken(tokenToVerify, sessionId)
    },
    [token, sessionId]
  )

  /**
   * Initialise le contexte CSRF
   */
  useEffect(() => {
    const initializeCSRF = async () => {
      try {
        // Vérifier s'il y a des tokens existants
        if (typeof window !== 'undefined') {
          const storedSessionId = sessionStorage.getItem('csrf-session-id')
          const storedToken = sessionStorage.getItem('csrf-token')

          if (storedSessionId && storedToken) {
            setSessionId(storedSessionId)
            setToken(storedToken)
            setIsReady(true)
            return
          }
        }

        // Générer de nouveaux tokens
        await generateToken()
        setIsReady(true)
      } catch (error) {
        console.error("Erreur lors de l'initialisation CSRF:", error)
        setIsReady(true) // Marquer comme prêt même en cas d'erreur
      }
    }

    initializeCSRF()
  }, [generateToken])

  const value: CSRFContextType = {
    token,
    sessionId,
    generateToken,
    verifyToken,
    isReady,
  }

  return <CSRFContext.Provider value={value}>{children}</CSRFContext.Provider>
}

/**
 * Hook pour sécuriser les formulaires avec CSRF
 */
export function useSecureForm() {
  const { token, sessionId, verifyToken, isReady } = useCSRF()

  /**
   * Soumet un formulaire de manière sécurisée
   */
  const submitSecureForm = useCallback(
    async (url: string, data: any, options: RequestInit = {}): Promise<Response> => {
      if (!isReady || !token || !sessionId) {
        throw new Error('Token CSRF non disponible')
      }

      // Vérifier le token avant soumission
      if (!verifyToken(token)) {
        throw new Error('Token CSRF invalide')
      }

      // Préparer les headers sécurisés
      const secureHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        'X-Session-ID': sessionId,
        ...options.headers,
      }

      // Soumettre la requête
      const response = await fetch(url, {
        ...options,
        method: options.method || 'POST',
        headers: secureHeaders,
        body: JSON.stringify(data),
      })

      // Vérifier la réponse
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Token CSRF expiré ou invalide')
        }
        throw new Error(`Erreur de soumission: ${response.statusText}`)
      }

      return response
    },
    [token, sessionId, verifyToken, isReady]
  )

  /**
   * Valide un token CSRF côté client
   */
  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!token || !sessionId) return false

    try {
      const response = await fetch('/api/csrf/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          token,
          sessionId,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error)
      return false
    }
  }, [token, sessionId])

  return {
    submitSecureForm,
    validateToken,
    token,
    sessionId,
    isReady,
  }
}

/**
 * Composant pour ajouter automatiquement le token CSRF aux formulaires
 */
export function CSRFInput() {
  const { token } = useCSRF()

  if (!token) return null

  return <input type="hidden" name="csrf-token" value={token} aria-hidden="true" />
}

/**
 * Hook pour les appels API sécurisés
 */
export function useSecureAPI() {
  const { token, sessionId, isReady } = useCSRF()

  /**
   * Effectue un appel API sécurisé
   */
  const secureFetch = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      if (!isReady || !token || !sessionId) {
        throw new Error('Token CSRF non disponible')
      }

      const secureHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
        'X-Session-ID': sessionId,
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers: secureHeaders,
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Token CSRF expiré ou invalide')
        }
        throw new Error(`Erreur API: ${response.statusText}`)
      }

      return response
    },
    [token, sessionId, isReady]
  )

  return {
    secureFetch,
    isReady,
    hasToken: !!token,
  }
}

/**
 * Composant de protection CSRF pour les formulaires
 */
export function CSRFProtection({ children }: { children: React.ReactNode }) {
  const { isReady } = useCSRF()

  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">
          Initialisation de la sécurité...
        </span>
      </div>
    )
  }

  return (
    <>
      <CSRFInput />
      {children}
    </>
  )
}
