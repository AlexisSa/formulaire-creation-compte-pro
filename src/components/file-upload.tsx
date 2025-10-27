'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, Check, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  compressImage,
  isImageFile,
  formatFileSize as formatSize,
} from '@/lib/image-compression'

interface FileUploadProps {
  label?: string
  error?: string
  accept?: Record<string, string[]>
  maxSize?: number
  onFileChange?: (file: File | null) => void
  onFileSelect?: (file: File) => void
  value?: File | null
  className?: string
}

/**
 * Composant d'upload de fichiers accessible avec drag & drop
 */
export function FileUpload({
  label = 'Document',
  error,
  accept = {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
  },
  maxSize = 10 * 1024 * 1024, // 10MB par défaut
  onFileChange,
  onFileSelect,
  value,
  className,
}: FileUploadProps) {
  const [isCompressing, setIsCompressing] = useState(false)

  const formatFileSize = useCallback((bytes: number): string => {
    return formatSize(bytes)
  }, [])

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        let file = acceptedFiles[0]

        // Compresser l'image automatiquement si c'est une image
        if (isImageFile(file)) {
          setIsCompressing(true)
          try {
            file = await compressImage(file, {
              maxSizeKB: 500,
              quality: 0.8,
            })
            console.log(`✅ Image compressée: ${file.name} (${formatSize(file.size)})`)
          } catch (error) {
            console.error('Erreur de compression:', error)
          } finally {
            setIsCompressing(false)
          }
        }

        // Appeler les callbacks
        if (onFileChange) {
          onFileChange(file)
        }
        if (onFileSelect) {
          onFileSelect(file)
        }
      }
    },
    [onFileChange, onFileSelect]
  )

  const onDropRejected = useCallback(
    (fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0]
        if (rejection.errors) {
          const error = rejection.errors[0]
          if (error.code === 'file-too-large') {
            alert(
              `⚠️ Le fichier est trop volumineux. Taille maximum : ${formatFileSize(
                maxSize
              )}`
            )
          } else if (error.code === 'file-invalid-type') {
            alert('⚠️ Type de fichier non autorisé. Formats acceptés : PDF, PNG, JPG')
          } else {
            alert(`⚠️ ${error.message || "Erreur lors de l'upload du fichier"}`)
          }
        }
      }
    },
    [maxSize, formatFileSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept,
    maxSize,
    multiple: false,
    noClick: false,
    noKeyboard: false,
  })

  const handleRemove = () => {
    onFileChange?.(null)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="file-upload">{label}</Label>

      {/* Indicateur de compression en cours */}
      <AnimatePresence>
        {isCompressing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-sm text-blue-700"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Optimisation de l&apos;image pour mobile...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!value ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-md p-4 sm:p-6 cursor-pointer transition-colors',
            'hover:border-primary/50 hover:bg-accent/50',
            isDragActive && 'border-primary bg-accent',
            error ? 'border-destructive' : 'border-input'
          )}
        >
          <input {...getInputProps()} id="file-upload" aria-label={label} />
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <Upload
              className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isDragActive ? (
                  'Déposez le fichier ici'
                ) : (
                  <>
                    <span className="font-semibold text-primary">
                      Cliquez pour parcourir
                    </span>{' '}
                    <span className="hidden sm:inline">ou glissez-déposez</span>
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground px-2">
                PDF, PNG, JPG • Jusqu&apos;à {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'border-2 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3',
              error
                ? 'border-destructive bg-destructive/5'
                : 'border-green-500 bg-green-50'
            )}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0 w-full sm:w-auto">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-green-500 flex-shrink-0"
              >
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
              </motion.div>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold truncate text-green-900"
                  title={value.name}
                >
                  {value.name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-xs text-green-700"
                >
                  {formatFileSize(value.size)}
                  <span className="ml-2 font-medium">✓ Ajouté</span>
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="self-end sm:self-auto"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                aria-label="Supprimer le fichier"
                className="hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
