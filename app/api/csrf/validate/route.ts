import { NextRequest, NextResponse } from 'next/server'
import { EncryptionUtils, ValidationUtils, RateLimiter } from '@/lib/security'

/**
 * API route pour la validation des tokens CSRF
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!RateLimiter.isAllowed(identifier)) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes',
          message: 'Limite de taux dépassée pour la validation CSRF',
        },
        { status: 429 }
      )
    }

    // Récupérer les headers de sécurité
    const csrfToken = request.headers.get('x-csrf-token')
    const sessionId = request.headers.get('x-session-id')

    if (!csrfToken || !sessionId) {
      return NextResponse.json(
        {
          error: 'Token manquant',
          message: 'Token CSRF ou ID de session manquant',
        },
        { status: 400 }
      )
    }

    // Valider le format des données
    try {
      ValidationUtils.validateCSRFToken({
        token: csrfToken,
        sessionId: sessionId,
      })
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Format invalide',
          message: error instanceof Error ? error.message : 'Format de token invalide',
        },
        { status: 400 }
      )
    }

    // Vérifier le token CSRF
    const isValid = EncryptionUtils.verifyCSRFToken(csrfToken, sessionId)

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Token invalide',
          message: 'Token CSRF invalide ou expiré',
        },
        { status: 403 }
      )
    }

    // Token valide
    return NextResponse.json(
      {
        success: true,
        message: 'Token CSRF valide',
        sessionId: sessionId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la validation CSRF:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la validation CSRF',
      },
      { status: 500 }
    )
  }
}

/**
 * API route pour générer un nouveau token CSRF
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!RateLimiter.isAllowed(identifier)) {
      return NextResponse.json(
        {
          error: 'Trop de requêtes',
          message: 'Limite de taux dépassée pour la génération CSRF',
        },
        { status: 429 }
      )
    }

    // Générer un nouveau token
    const token = EncryptionUtils.generateCSRFToken()
    const sessionId = crypto.randomUUID()

    return NextResponse.json(
      {
        success: true,
        token: token,
        sessionId: sessionId,
        message: 'Token CSRF généré avec succès',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la génération CSRF:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la génération CSRF',
      },
      { status: 500 }
    )
  }
}
