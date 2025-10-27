import crypto from 'crypto'
import { z } from 'zod'

/**
 * Configuration de sécurité
 */
export const SECURITY_CONFIG = {
  // Clés de chiffrement
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
  CSRF_SECRET: process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex'),

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // 100 requêtes par fenêtre
    SKIP_SUCCESSFUL_REQUESTS: false,
  },

  // Validation
  VALIDATION: {
    MAX_STRING_LENGTH: 1000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  },

  // Headers de sécurité
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },
}

/**
 * Utilitaires de chiffrement
 */
export class EncryptionUtils {
  private static readonly ALGORITHM = 'aes-256-gcm'
  private static readonly IV_LENGTH = 16
  private static readonly TAG_LENGTH = 16

  /**
   * Chiffre une chaîne de caractères
   */
  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH)
      const cipher = crypto.createCipher(this.ALGORITHM, SECURITY_CONFIG.ENCRYPTION_KEY)
      cipher.setAAD(Buffer.from('account-form-data'))

      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')

      const tag = cipher.getAuthTag()

      return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
    } catch (error) {
      console.error('Erreur de chiffrement:', error)
      throw new Error('Erreur lors du chiffrement des données')
    }
  }

  /**
   * Déchiffre une chaîne de caractères
   */
  static decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':')
      if (parts.length !== 3) {
        throw new Error('Format de données chiffrées invalide')
      }

      const iv = Buffer.from(parts[0], 'hex')
      const tag = Buffer.from(parts[1], 'hex')
      const encrypted = parts[2]

      const decipher = crypto.createDecipher(
        this.ALGORITHM,
        SECURITY_CONFIG.ENCRYPTION_KEY
      )
      decipher.setAAD(Buffer.from('account-form-data'))
      decipher.setAuthTag(tag)

      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error('Erreur de déchiffrement:', error)
      throw new Error('Erreur lors du déchiffrement des données')
    }
  }

  /**
   * Génère un hash sécurisé
   */
  static hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex')
  }

  /**
   * Génère un token CSRF
   */
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Vérifie un token CSRF
   */
  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    try {
      const expectedToken = crypto
        .createHmac('sha256', SECURITY_CONFIG.CSRF_SECRET)
        .update(sessionToken)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(token, 'hex'),
        Buffer.from(expectedToken, 'hex')
      )
    } catch (error) {
      console.error('Erreur de vérification CSRF:', error)
      return false
    }
  }
}

/**
 * Schémas de validation renforcés
 */
export const SecuritySchemas = {
  // Validation des données d'entreprise
  companyData: z.object({
    siren: z
      .string()
      .min(9, 'Le SIREN doit contenir 9 chiffres')
      .max(9, 'Le SIREN doit contenir 9 chiffres')
      .regex(/^\d{9}$/, 'Le SIREN doit contenir uniquement des chiffres'),

    siret: z
      .string()
      .min(14, 'Le SIRET doit contenir 14 chiffres')
      .max(14, 'Le SIRET doit contenir 14 chiffres')
      .regex(/^\d{14}$/, 'Le SIRET doit contenir uniquement des chiffres'),

    nafApe: z
      .string()
      .min(5, 'Le code NAF/APE doit contenir 5 caractères')
      .max(5, 'Le code NAF/APE doit contenir 5 caractères')
      .regex(/^[0-9]{2}\.[0-9]{2}[A-Z]$/, 'Format NAF/APE invalide'),

    tvaIntracom: z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Z]{2}[0-9]{2}[0-9A-Z]{8,12}$/.test(val), {
        message: 'Format TVA intracommunautaire invalide',
      }),

    companyName: z
      .string()
      .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
      .max(SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH, "Nom d'entreprise trop long")
      .regex(
        /^[a-zA-Z0-9\s\-'&.,()]+$/,
        "Caractères non autorisés dans le nom d'entreprise"
      ),

    address: z
      .string()
      .min(5, "L'adresse doit contenir au moins 5 caractères")
      .max(SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH, 'Adresse trop longue'),

    postalCode: z
      .string()
      .min(5, 'Le code postal doit contenir 5 chiffres')
      .max(5, 'Le code postal doit contenir 5 chiffres')
      .regex(/^\d{5}$/, 'Le code postal doit contenir uniquement des chiffres'),

    city: z
      .string()
      .min(2, 'Le nom de la ville doit contenir au moins 2 caractères')
      .max(100, 'Nom de ville trop long')
      .regex(/^[a-zA-Z\s\-'&.,()]+$/, 'Caractères non autorisés dans le nom de ville'),
  }),

  // Validation des données de contact
  contactData: z.object({
    email: z
      .string()
      .email('Adresse email invalide')
      .max(254, 'Adresse email trop longue')
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Format email invalide'),

    phone: z
      .string()
      .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres')
      .max(15, 'Le numéro de téléphone ne peut pas dépasser 15 chiffres')
      .regex(/^[+]?[0-9\s\-().]+$/, 'Format de téléphone invalide'),
  }),

  // Validation des fichiers
  fileData: z.object({
    fileName: z
      .string()
      .min(1, 'Le nom du fichier est requis')
      .max(255, 'Nom de fichier trop long')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Caractères non autorisés dans le nom de fichier'),

    fileSize: z
      .number()
      .min(1, 'Le fichier ne peut pas être vide')
      .max(SECURITY_CONFIG.VALIDATION.MAX_FILE_SIZE, 'Fichier trop volumineux'),

    fileType: z
      .string()
      .refine((type) => SECURITY_CONFIG.VALIDATION.ALLOWED_FILE_TYPES.includes(type), {
        message: 'Type de fichier non autorisé',
      }),

    fileContent: z.string().min(1, 'Le contenu du fichier est requis'),
  }),

  // Validation des signatures
  signatureData: z.object({
    signatureData: z
      .string()
      .min(1, 'La signature est requise')
      .max(100000, 'Signature trop volumineuse'),

    signatureFormat: z
      .enum(['image/png', 'image/jpeg'])
      .refine((format) => ['image/png', 'image/jpeg'].includes(format), {
        message: 'Format de signature non supporté',
      }),
  }),

  // Validation des tokens CSRF
  csrfToken: z.object({
    token: z
      .string()
      .min(64, 'Token CSRF invalide')
      .max(64, 'Token CSRF invalide')
      .regex(/^[a-f0-9]{64}$/, 'Format de token CSRF invalide'),

    sessionId: z
      .string()
      .min(32, 'ID de session invalide')
      .max(128, 'ID de session invalide'),
  }),
}

/**
 * Utilitaires de validation
 */
export class ValidationUtils {
  /**
   * Valide les données d'entreprise
   */
  static validateCompanyData(data: unknown) {
    try {
      return SecuritySchemas.companyData.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Erreur de validation: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw new Error("Erreur de validation des données d'entreprise")
    }
  }

  /**
   * Valide les données de contact
   */
  static validateContactData(data: unknown) {
    try {
      return SecuritySchemas.contactData.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Erreur de validation: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw new Error('Erreur de validation des données de contact')
    }
  }

  /**
   * Valide les données de fichier
   */
  static validateFileData(data: unknown) {
    try {
      return SecuritySchemas.fileData.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Erreur de validation: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw new Error('Erreur de validation des données de fichier')
    }
  }

  /**
   * Valide les données de signature
   */
  static validateSignatureData(data: unknown) {
    try {
      return SecuritySchemas.signatureData.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Erreur de validation: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw new Error('Erreur de validation des données de signature')
    }
  }

  /**
   * Valide un token CSRF
   */
  static validateCSRFToken(data: unknown) {
    try {
      return SecuritySchemas.csrfToken.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Erreur de validation: ${error.errors.map((e) => e.message).join(', ')}`
        )
      }
      throw new Error('Erreur de validation du token CSRF')
    }
  }

  /**
   * Nettoie les données d'entrée
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Supprime les balises HTML
      .replace(/javascript:/gi, '') // Supprime les scripts JavaScript
      .replace(/on\w+=/gi, '') // Supprime les gestionnaires d'événements
      .substring(0, SECURITY_CONFIG.VALIDATION.MAX_STRING_LENGTH)
  }

  /**
   * Valide l'origine de la requête
   */
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    try {
      const url = new URL(origin)
      return allowedOrigins.includes(url.origin)
    } catch {
      return false
    }
  }
}

/**
 * Gestionnaire de rate limiting
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>()

  /**
   * Vérifie si une requête est autorisée
   */
  static isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS

    // Nettoyer les entrées expirées
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime < now) {
        this.requests.delete(key)
      }
    }

    const current = this.requests.get(identifier)

    if (!current) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
      })
      return true
    }

    if (current.count >= SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
      return false
    }

    current.count++
    return true
  }

  /**
   * Obtient les informations de rate limiting
   */
  static getInfo(identifier: string): {
    count: number
    resetTime: number
    remaining: number
  } {
    const current = this.requests.get(identifier)
    if (!current) {
      return {
        count: 0,
        resetTime: Date.now() + SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
        remaining: SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS,
      }
    }

    return {
      count: current.count,
      resetTime: current.resetTime,
      remaining: Math.max(0, SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS - current.count),
    }
  }
}

/**
 * Middleware de sécurité pour Next.js
 */
export function securityMiddleware(req: any, res: any, next: any) {
  // Headers de sécurité
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  // Rate limiting
  const identifier = req.ip || req.connection.remoteAddress || 'unknown'
  if (!RateLimiter.isAllowed(identifier)) {
    return res.status(429).json({
      error: 'Trop de requêtes',
      message: 'Limite de taux dépassée. Veuillez réessayer plus tard.',
    })
  }

  // Validation de l'origine
  const origin = req.headers.origin
  if (
    origin &&
    !ValidationUtils.validateOrigin(origin, [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
    ])
  ) {
    return res.status(403).json({
      error: 'Origine non autorisée',
      message: "Requête provenant d'une origine non autorisée.",
    })
  }

  next()
}

/**
 * Types pour la sécurité
 */
export interface SecurityContext {
  isAuthenticated: boolean
  sessionId: string
  csrfToken: string
  rateLimitInfo: {
    count: number
    resetTime: number
    remaining: number
  }
}

export interface SecureRequest {
  headers: {
    'x-csrf-token'?: string
    'x-session-id'?: string
    origin?: string
  }
  body: any
  ip?: string
}
