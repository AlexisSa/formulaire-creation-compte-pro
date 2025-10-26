/**
 * Configuration de sécurité pour l'application
 * Ce fichier contient toutes les configurations de sécurité centralisées
 */

export const SecurityConfig = {
  // Configuration générale
  isEnabled: process.env.SECURITY_ENABLED === 'true',
  environment: process.env.NODE_ENV || 'development',

  // Clés de chiffrement
  encryption: {
    key: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production',
    algorithm: 'aes-256-gcm',
    ivLength: 16,
    tagLength: 16,
  },

  // Protection CSRF
  csrf: {
    enabled: process.env.CSRF_PROTECTION_ENABLED === 'true',
    secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
    tokenLength: 32,
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24h
  },

  // Rate limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED === 'true',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    skipSuccessfulRequests: false,
  },

  // Chiffrement des données
  dataEncryption: {
    enabled: process.env.DATA_ENCRYPTION_ENABLED === 'true',
    sensitiveFields: ['siren', 'siret', 'tvaIntracom', 'email', 'phone'],
  },

  // Validation des données
  validation: {
    maxStringLength: parseInt(process.env.MAX_STRING_LENGTH || '1000'),
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxRequestSize: parseInt(process.env.MAX_REQUEST_SIZE || '10485760'), // 10MB
  },

  // Origines autorisées
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3002',
    'http://localhost:3000',
    'http://localhost:3001',
  ],

  // Headers de sécurité
  securityHeaders: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // Content Security Policy
  csp: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: blob:",
    'font-src': "'self'",
    'connect-src': "'self'",
    'frame-ancestors': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
  },

  // Configuration des cookies
  cookies: {
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'),
  },

  // Logs de sécurité
  logging: {
    enabled: process.env.SECURITY_LOG_ENABLED === 'true',
    level: process.env.SECURITY_LOG_LEVEL || 'info',
    logSensitiveOperations: true,
    logFailedAttempts: true,
  },

  // Configuration des sessions
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'),
    rolling: true,
    resave: false,
    saveUninitialized: false,
  },

  // Configuration de la base de données
  database: {
    url: process.env.DATABASE_URL,
    encryptionKey: process.env.DATABASE_ENCRYPTION_KEY,
    ssl: process.env.NODE_ENV === 'production',
  },

  // Configuration des API externes
  externalAPIs: {
    insee: {
      baseUrl: process.env.INSEE_API_URL || 'https://api.insee.fr',
      timeout: 10000,
      retries: 3,
    },
  },

  // Configuration des tests
  testing: {
    enabled: process.env.NODE_ENV === 'test',
    mockEncryption: process.env.NODE_ENV === 'test',
    skipRateLimit: process.env.NODE_ENV === 'test',
  },
}

/**
 * Validation de la configuration de sécurité
 */
export function validateSecurityConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Vérifier les clés de chiffrement en production
  if (SecurityConfig.environment === 'production') {
    if (SecurityConfig.encryption.key === 'default-encryption-key-change-in-production') {
      errors.push('Clé de chiffrement par défaut détectée en production')
    }

    if (SecurityConfig.csrf.secret === 'default-csrf-secret-change-in-production') {
      errors.push('Secret CSRF par défaut détecté en production')
    }

    if (SecurityConfig.session.secret === 'default-session-secret-change-in-production') {
      errors.push('Secret de session par défaut détecté en production')
    }
  }

  // Vérifier les origines autorisées
  if (SecurityConfig.allowedOrigins.length === 0) {
    errors.push('Aucune origine autorisée configurée')
  }

  // Vérifier les limites de sécurité
  if (SecurityConfig.validation.maxFileSize > 50 * 1024 * 1024) {
    // 50MB
    errors.push('Taille maximale de fichier trop élevée')
  }

  if (SecurityConfig.rateLimit.maxRequests > 1000) {
    errors.push('Limite de taux trop élevée')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Génération de clés sécurisées pour le développement
 */
export function generateSecureKeys(): {
  encryptionKey: string
  csrfSecret: string
  sessionSecret: string
} {
  const crypto = require('crypto')

  return {
    encryptionKey: crypto.randomBytes(32).toString('hex'),
    csrfSecret: crypto.randomBytes(32).toString('hex'),
    sessionSecret: crypto.randomBytes(32).toString('hex'),
  }
}

/**
 * Configuration par environnement
 */
export const EnvironmentConfig = {
  development: {
    ...SecurityConfig,
    logging: {
      ...SecurityConfig.logging,
      level: 'debug',
    },
    rateLimit: {
      ...SecurityConfig.rateLimit,
      maxRequests: 1000, // Plus permissif en développement
    },
  },

  production: {
    ...SecurityConfig,
    logging: {
      ...SecurityConfig.logging,
      level: 'warn',
    },
    cookies: {
      ...SecurityConfig.cookies,
      secure: true,
    },
  },

  test: {
    ...SecurityConfig,
    testing: {
      enabled: true,
      mockEncryption: true,
      skipRateLimit: true,
    },
    rateLimit: {
      ...SecurityConfig.rateLimit,
      enabled: false,
    },
  },
}

/**
 * Obtient la configuration pour l'environnement actuel
 */
export function getEnvironmentConfig() {
  const env = SecurityConfig.environment as keyof typeof EnvironmentConfig
  return EnvironmentConfig[env] || SecurityConfig
}
