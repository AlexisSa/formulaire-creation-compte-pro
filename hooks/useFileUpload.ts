import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileWithPreview extends File {
  preview?: string
}

interface UseFileUploadOptions {
  maxFiles?: number
  maxSize?: number // en bytes
  acceptedTypes?: string[]
  onError?: (error: string) => void
}

export interface UseFileUploadReturn {
  // État
  files: FileWithPreview[]
  isDragActive: boolean
  isLoading: boolean
  error: string | null

  // Actions
  addFiles: (newFiles: File[]) => void
  removeFile: (index: number) => void
  clearFiles: () => void

  // Dropzone props
  getRootProps: () => any
  getInputProps: () => any
}

/**
 * Hook personnalisé pour gérer l'upload de fichiers avec drag & drop
 * Inclut la validation, la prévisualisation et la gestion d'erreurs
 */
export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    acceptedTypes = ['.pdf', '.png', '.jpg', '.jpeg'],
    onError,
  } = options

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Validation d'un fichier
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Vérifier la taille
      if (file.size > maxSize) {
        return `Le fichier "${file.name}" est trop volumineux (max ${Math.round(
          maxSize / 1024 / 1024
        )}MB)`
      }

      // Vérifier le type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!acceptedTypes.includes(fileExtension)) {
        return `Le fichier "${
          file.name
        }" n'est pas dans un format accepté (${acceptedTypes.join(', ')})`
      }

      return null
    },
    [maxSize, acceptedTypes]
  )

  /**
   * Ajout de fichiers avec validation
   */
  const addFiles = useCallback(
    (newFiles: File[]) => {
      setError(null)
      setIsLoading(true)

      try {
        const validFiles: FileWithPreview[] = []
        const errors: string[] = []

        // Vérifier le nombre maximum de fichiers
        if (files.length + newFiles.length > maxFiles) {
          errors.push(`Maximum ${maxFiles} fichiers autorisés`)
        }

        // Valider chaque fichier
        newFiles.forEach((file) => {
          const validationError = validateFile(file)
          if (validationError) {
            errors.push(validationError)
          } else {
            // Créer une prévisualisation pour les images
            const fileWithPreview = file as FileWithPreview
            if (file.type.startsWith('image/')) {
              fileWithPreview.preview = URL.createObjectURL(file)
            }
            validFiles.push(fileWithPreview)
          }
        })

        if (errors.length > 0) {
          const errorMessage = errors.join('\n')
          setError(errorMessage)
          onError?.(errorMessage)
          return
        }

        // Ajouter les fichiers valides
        setFiles((prev) => [...prev, ...validFiles])
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de l'ajout des fichiers"
        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [files.length, maxFiles, validateFile, onError]
  )

  /**
   * Suppression d'un fichier
   */
  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      const fileToRemove = newFiles[index]

      // Nettoyer l'URL de prévisualisation
      if (fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }

      newFiles.splice(index, 1)
      return newFiles
    })
    setError(null)
  }, [])

  /**
   * Suppression de tous les fichiers
   */
  const clearFiles = useCallback(() => {
    // Nettoyer toutes les URLs de prévisualisation
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })

    setFiles([])
    setError(null)
  }, [files])

  /**
   * Configuration du dropzone
   */
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles)
    },
    [addFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - files.length,
    maxSize,
    disabled: isLoading,
  })

  // Nettoyage des URLs au démontage
  const cleanupRef = useRef(() => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
  })

  // Nettoyage au démontage
  useState(() => {
    return () => {
      cleanupRef.current()
    }
  })

  return {
    // État
    files,
    isDragActive,
    isLoading,
    error,

    // Actions
    addFiles,
    removeFile,
    clearFiles,

    // Dropzone
    getRootProps,
    getInputProps,
  }
}
