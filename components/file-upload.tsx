'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, Check } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

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

  const onDropRejected = useCallback((fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      if (rejection.errors) {
        const error = rejection.errors[0]
        if (error.code === 'file-too-large') {
          alert(`⚠️ Le fichier est trop volumineux. Taille maximum : ${formatFileSize(maxSize)}`)
        } else if (error.code === 'file-invalid-type') {
          alert('⚠️ Type de fichier non autorisé. Formats acceptés : PDF, PNG, JPG')
        } else {
          alert(`⚠️ ${error.message || 'Erreur lors de l\'upload du fichier'}`)
        }
      }
    }
  }, [maxSize, formatFileSize])

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

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }, [])

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor="file-upload">{label}</Label>

      {!value ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors',
            'hover:border-primary/50 hover:bg-accent/50',
            isDragActive && 'border-primary bg-accent',
            error ? 'border-destructive' : 'border-input'
          )}
        >
          <input {...getInputProps()} id="file-upload" aria-label={label} />
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <Upload className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isDragActive ? (
                  'Déposez le fichier ici'
                ) : (
                  <>
                    <span className="font-semibold text-primary">
                      Cliquez pour parcourir
                    </span>{' '}
                    ou glissez-déposez
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, PNG, JPG jusqu&apos;à {formatFileSize(maxSize)}
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
              'border-2 rounded-lg p-4 flex items-center justify-between',
              error
                ? 'border-destructive bg-destructive/5'
                : 'border-green-500 bg-green-50'
            )}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500"
              >
                <Check className="h-5 w-5 text-white" aria-hidden="true" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold truncate text-green-900"
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
                  <span className="ml-2 font-medium">✓ Fichier ajouté avec succès</span>
                </motion.p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
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
