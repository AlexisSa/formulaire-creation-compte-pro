import { NextRequest, NextResponse } from 'next/server'
import { searchEntrepriseByNameAndPostal } from '@/services/insee'

// Force cette route à être dynamique (pas de pre-rendering)
export const dynamic = 'force-dynamic'

/**
 * Route API pour rechercher une entreprise via INSEE
 * Évite les problèmes CORS en faisant la requête côté serveur
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    const postalCode = searchParams.get('postalCode')

    // Validation des paramètres
    if (!name) {
      return NextResponse.json(
        { error: "Le nom de l'entreprise est requis" },
        { status: 400 }
      )
    }

    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      )
    }

    // Code postal optionnel, mais s'il est fourni, il doit être valide
    if (postalCode && !/^\d{5}$/.test(postalCode)) {
      return NextResponse.json(
        { error: 'Le code postal doit contenir 5 chiffres' },
        { status: 400 }
      )
    }

    // Recherche via le service INSEE
    const results = await searchEntrepriseByNameAndPostal(name, postalCode || undefined)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Erreur API INSEE:', error)

    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
