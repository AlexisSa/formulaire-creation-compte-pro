import { NextRequest, NextResponse } from 'next/server'
import { EncryptionUtils, ValidationUtils, RateLimiter } from '@/lib/security'

/**
 * API route sécurisée pour la sauvegarde des données d'entreprise
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

    // Vérifier les headers de sécurité
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

    // Vérifier le token CSRF
    if (!EncryptionUtils.verifyCSRFToken(csrfToken, sessionId)) {
      return NextResponse.json(
        {
          error: 'Token invalide',
          message: 'Token CSRF invalide ou expiré',
        },
        { status: 403 }
      )
    }

    // Récupérer et valider les données
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          error: 'Données invalides',
          message: 'Format de données invalide',
        },
        { status: 400 }
      )
    }

    // Valider les données d'entreprise
    let validatedData
    try {
      validatedData = ValidationUtils.validateCompanyData(body)
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Validation échouée',
          message: error instanceof Error ? error.message : 'Erreur de validation',
        },
        { status: 400 }
      )
    }

    // Nettoyer les données d'entrée
    const sanitizedData = {
      siren: ValidationUtils.sanitizeInput(validatedData.siren),
      siret: ValidationUtils.sanitizeInput(validatedData.siret),
      nafApe: ValidationUtils.sanitizeInput(validatedData.nafApe),
      tvaIntracom: validatedData.tvaIntracom
        ? ValidationUtils.sanitizeInput(validatedData.tvaIntracom)
        : undefined,
      companyName: ValidationUtils.sanitizeInput(validatedData.companyName),
      address: ValidationUtils.sanitizeInput(validatedData.address),
      postalCode: ValidationUtils.sanitizeInput(validatedData.postalCode),
      city: ValidationUtils.sanitizeInput(validatedData.city),
    }

    // Chiffrer les données sensibles
    const encryptedData = {
      ...sanitizedData,
      // Chiffrer les données sensibles
      siren: EncryptionUtils.encrypt(sanitizedData.siren),
      siret: EncryptionUtils.encrypt(sanitizedData.siret),
      tvaIntracom: sanitizedData.tvaIntracom
        ? EncryptionUtils.encrypt(sanitizedData.tvaIntracom)
        : undefined,
      // Ajouter des métadonnées de sécurité
      _security: {
        encrypted: true,
        timestamp: Date.now(),
        sessionId: sessionId,
        hash: EncryptionUtils.hash(JSON.stringify(sanitizedData)),
      },
    }

    // Ici, vous pourriez sauvegarder les données dans une base de données
    // Pour l'instant, on simule une sauvegarde réussie
    console.log('Données sécurisées sauvegardées:', {
      ...encryptedData,
      // Ne pas logger les données chiffrées en production
      siren: '[CHIFFRÉ]',
      siret: '[CHIFFRÉ]',
      tvaIntracom: sanitizedData.tvaIntracom ? '[CHIFFRÉ]' : undefined,
    })

    // Retourner une réponse sécurisée
    return NextResponse.json(
      {
        success: true,
        message: "Données d'entreprise sauvegardées avec succès",
        data: {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          // Retourner seulement les données non sensibles
          companyName: sanitizedData.companyName,
          address: sanitizedData.address,
          postalCode: sanitizedData.postalCode,
          city: sanitizedData.city,
          nafApe: sanitizedData.nafApe,
        },
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
    console.error('Erreur lors de la sauvegarde sécurisée:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la sauvegarde',
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
 * API route pour récupérer les données d'entreprise (déchiffrement)
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

    // Vérifier les headers de sécurité
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

    // Vérifier le token CSRF
    if (!EncryptionUtils.verifyCSRFToken(csrfToken, sessionId)) {
      return NextResponse.json(
        {
          error: 'Token invalide',
          message: 'Token CSRF invalide ou expiré',
        },
        { status: 403 }
      )
    }

    // Récupérer l'ID de l'entreprise depuis les paramètres de requête
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('id')

    if (!companyId) {
      return NextResponse.json(
        {
          error: 'ID manquant',
          message: "ID de l'entreprise requis",
        },
        { status: 400 }
      )
    }

    // Ici, vous récupéreriez les données chiffrées depuis la base de données
    // Pour l'instant, on simule des données chiffrées
    const mockEncryptedData = {
      siren: EncryptionUtils.encrypt('123456789'),
      siret: EncryptionUtils.encrypt('12345678901234'),
      nafApe: '62.01Z',
      tvaIntracom: EncryptionUtils.encrypt('FR12345678901'),
      companyName: 'Entreprise Test',
      address: '123 Rue de la Paix',
      postalCode: '75001',
      city: 'Paris',
      _security: {
        encrypted: true,
        timestamp: Date.now(),
        sessionId: sessionId,
        hash: 'mock-hash',
      },
    }

    // Déchiffrer les données sensibles
    const decryptedData = {
      siren: EncryptionUtils.decrypt(mockEncryptedData.siren),
      siret: EncryptionUtils.decrypt(mockEncryptedData.siret),
      nafApe: mockEncryptedData.nafApe,
      tvaIntracom: mockEncryptedData.tvaIntracom
        ? EncryptionUtils.decrypt(mockEncryptedData.tvaIntracom)
        : undefined,
      companyName: mockEncryptedData.companyName,
      address: mockEncryptedData.address,
      postalCode: mockEncryptedData.postalCode,
      city: mockEncryptedData.city,
    }

    return NextResponse.json(
      {
        success: true,
        message: "Données d'entreprise récupérées avec succès",
        data: decryptedData,
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
    console.error('Erreur lors de la récupération sécurisée:', error)

    return NextResponse.json(
      {
        error: 'Erreur serveur',
        message: 'Erreur interne lors de la récupération',
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
