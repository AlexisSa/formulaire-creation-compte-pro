import { NextRequest, NextResponse } from 'next/server'
import { getEnvironmentConfig, validateSecurityConfig } from '@/lib/security-config'
import { RateLimiter } from '@/lib/security'

/**
 * API route pour obtenir le statut de sécurité
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!RateLimiter.isAllowed(identifier)) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes',
          message: 'Limite de taux dépassée',
        },
        { status: 429 }
      )
    }

    // Obtenir la configuration de sécurité
    const config = getEnvironmentConfig()
    const validation = validateSecurityConfig()

    // Statut des composants de sécurité
    const securityStatus = {
      overall: config.isEnabled && validation.isValid,
      csrf: config.csrf.enabled,
      encryption: config.dataEncryption.enabled,
      rateLimit: config.rateLimit.enabled,
      validation: true, // Toujours activé
      headers: true, // Toujours activé
      environment: config.environment,
      timestamp: Date.now(),
    }

    // Informations de configuration (sans données sensibles)
    const configInfo = {
      environment: config.environment,
      isEnabled: config.isEnabled,
      validationErrors: validation.errors,
      rateLimitInfo: RateLimiter.getInfo(identifier),
      features: {
        csrf: config.csrf.enabled,
        encryption: config.dataEncryption.enabled,
        rateLimit: config.rateLimit.enabled,
        validation: true,
        securityHeaders: true,
      },
      limits: {
        maxFileSize: config.validation.maxFileSize,
        maxStringLength: config.validation.maxStringLength,
        rateLimitMaxRequests: config.rateLimit.maxRequests,
        rateLimitWindowMs: config.rateLimit.windowMs,
      },
    }

    return NextResponse.json(
      {
        success: true,
        status: securityStatus,
        config: configInfo,
        message: 'Statut de sécurité récupéré avec succès',
      },
      {
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de sécurité:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la récupération du statut',
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      }
    )
  }
}

/**
 * API route pour vérifier la santé de la sécurité
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!RateLimiter.isAllowed(identifier)) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes',
          message: 'Limite de taux dépassée',
        },
        { status: 429 }
      )
    }

    // Récupérer les données de la requête
    const body = await request.json()
    const { checkType } = body

    const config = getEnvironmentConfig()
    const validation = validateSecurityConfig()

    let healthStatus = {
      overall: true,
      checks: [] as Array<{ name: string; status: boolean; message: string }>,
    }

    // Vérifications de santé
    const checks = [
      {
        name: 'Configuration générale',
        status: config.isEnabled,
        message: config.isEnabled ? 'Sécurité activée' : 'Sécurité désactivée',
      },
      {
        name: 'Validation de configuration',
        status: validation.isValid,
        message: validation.isValid
          ? 'Configuration valide'
          : `Erreurs: ${validation.errors.join(', ')}`,
      },
      {
        name: 'Protection CSRF',
        status: config.csrf.enabled,
        message: config.csrf.enabled ? 'CSRF activé' : 'CSRF désactivé',
      },
      {
        name: 'Chiffrement des données',
        status: config.dataEncryption.enabled,
        message: config.dataEncryption.enabled
          ? 'Chiffrement activé'
          : 'Chiffrement désactivé',
      },
      {
        name: 'Limitation de taux',
        status: config.rateLimit.enabled,
        message: config.rateLimit.enabled
          ? 'Rate limiting activé'
          : 'Rate limiting désactivé',
      },
    ]

    // Ajouter des vérifications spécifiques selon le type
    if (checkType === 'full') {
      checks.push(
        {
          name: 'Headers de sécurité',
          status: true,
          message: 'Headers configurés',
        },
        {
          name: 'Origines autorisées',
          status: config.allowedOrigins.length > 0,
          message:
            config.allowedOrigins.length > 0
              ? `${config.allowedOrigins.length} origines configurées`
              : 'Aucune origine configurée',
        }
      )
    }

    healthStatus.checks = checks
    healthStatus.overall = checks.every((check) => check.status)

    return NextResponse.json(
      {
        success: true,
        health: healthStatus,
        timestamp: Date.now(),
        message: 'Vérification de santé terminée',
      },
      {
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  } catch (error) {
    console.error('Erreur lors de la vérification de santé:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la vérification',
      },
      {
        status: 500,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        },
      }
    )
  }
}
