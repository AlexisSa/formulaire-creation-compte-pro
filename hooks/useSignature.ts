import { useState, useCallback, useRef } from 'react'

interface UseSignatureOptions {
  onError?: (error: string) => void
}

export interface UseSignatureReturn {
  // État
  isEmpty: boolean
  isLoading: boolean
  error: string | null

  // Actions
  clearSignature: () => void
  saveSignature: () => string | null
  loadSignature: (dataUrl: string) => void

  // Refs pour le canvas
  canvasRef: React.RefObject<HTMLCanvasElement>

  // Utilitaires
  validateSignature: () => boolean
}

/**
 * Hook personnalisé pour gérer la signature électronique
 * Fournit une interface simple pour interagir avec le canvas de signature
 */
export function useSignature(options: UseSignatureOptions = {}): UseSignatureReturn {
  const { onError } = options

  const [isEmpty, setIsEmpty] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  /**
   * Effacer la signature
   */
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setIsEmpty(true)
    setError(null)
  }, [])

  /**
   * Sauvegarder la signature en base64
   */
  const saveSignature = useCallback((): string | null => {
    const canvas = canvasRef.current
    if (!canvas) {
      const errorMsg = 'Canvas de signature non disponible'
      setError(errorMsg)
      onError?.(errorMsg)
      return null
    }

    try {
      // Vérifier si la signature n'est pas vide
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        const errorMsg = 'Contexte canvas non disponible'
        setError(errorMsg)
        onError?.(errorMsg)
        return null
      }

      // Vérifier s'il y a du contenu sur le canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasContent = imageData.data.some((value, index) => {
        // Ignorer le canal alpha (tous les 4 pixels)
        if (index % 4 === 3) return false
        return value !== 0
      })

      if (!hasContent) {
        const errorMsg = 'La signature est requise'
        setError(errorMsg)
        onError?.(errorMsg)
        return null
      }

      // Convertir en base64
      const dataUrl = canvas.toDataURL('image/png')
      setIsEmpty(false)
      setError(null)

      return dataUrl
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la sauvegarde de la signature'
      setError(errorMsg)
      onError?.(errorMsg)
      return null
    }
  }, [onError])

  /**
   * Charger une signature depuis une URL base64
   */
  const loadSignature = useCallback(
    (dataUrl: string) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      setIsLoading(true)
      setError(null)

      try {
        const img = new Image()
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          setIsEmpty(false)
          setIsLoading(false)
        }

        img.onerror = () => {
          const errorMsg = "Erreur lors du chargement de l'image"
          setError(errorMsg)
          onError?.(errorMsg)
          setIsLoading(false)
        }

        img.src = dataUrl
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Erreur lors du chargement de la signature'
        setError(errorMsg)
        onError?.(errorMsg)
        setIsLoading(false)
      }
    },
    [onError]
  )

  /**
   * Validation de la signature
   */
  const validateSignature = useCallback((): boolean => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasContent = imageData.data.some((value, index) => {
        if (index % 4 === 3) return false // Ignorer le canal alpha
        return value !== 0
      })

      if (!hasContent) {
        setError('La signature est requise')
        return false
      }

      setError(null)
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la validation'
      setError(errorMsg)
      return false
    }
  }, [])

  return {
    // État
    isEmpty,
    isLoading,
    error,

    // Actions
    clearSignature,
    saveSignature,
    loadSignature,

    // Refs
    canvasRef,

    // Utilitaires
    validateSignature,
  }
}
