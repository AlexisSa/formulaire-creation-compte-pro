/**
 * Constantes utilisées dans l'application
 */

export const FILE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: {
    'application/pdf': ['.pdf'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
  },
  acceptedMimeTypes: ['application/pdf', 'image/png', 'image/jpeg'],
} as const

export const VALIDATION_MESSAGES = {
  required: 'Ce champ est obligatoire',
  email: 'Adresse email invalide',
  phone: 'Numéro de téléphone invalide',
  siret: 'Le SIRET doit contenir 14 chiffres',
  postalCode: 'Code postal invalide (5 chiffres)',
  fileSize: 'Le fichier ne doit pas dépasser 5MB',
  fileType: 'Format de fichier non supporté',
  signature: 'La signature est obligatoire',
} as const

export const REGEX_PATTERNS = {
  siret: /^\d{14}$/,
  phone: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
  postalCode: /^\d{5}$/,
} as const

