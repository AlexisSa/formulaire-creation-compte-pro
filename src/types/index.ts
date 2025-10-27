/**
 * Types personnalisés pour l'application
 */

export interface FileWithPreview extends File {
  preview?: string
}

export interface FormFieldError {
  message: string
  type: string
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

