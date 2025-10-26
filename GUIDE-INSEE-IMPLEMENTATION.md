# Guide d'implémentation : Recherche d'entreprises INSEE avec nom et code postal

Ce guide explique comment implémenter une recherche d'entreprises via l'API INSEE Sirene avec deux champs de recherche : nom de l'entreprise et code postal. L'implémentation inclut un composant d'autocomplete avec debounce, gestion d'erreurs robuste et interface utilisateur accessible.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration de l'API INSEE](#configuration-de-lapi-insee)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Types TypeScript](#types-typescript)
5. [Service de recherche](#service-de-recherche)
6. [Route API Next.js](#route-api-nextjs)
7. [Composant d'autocomplete](#composant-dautocomplete)
8. [Utilisation dans un formulaire](#utilisation-dans-un-formulaire)
9. [Gestion des erreurs](#gestion-des-erreurs)
10. [Bonnes pratiques](#bonnes-pratiques)

## 🔧 Prérequis

- **Framework** : Next.js 13+ (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS (optionnel)
- **Icônes** : Lucide React (optionnel)
- **Clé API INSEE** : Obtenez votre clé sur [api.insee.fr](https://api.insee.fr)

## 🔑 Configuration de l'API INSEE

### 1. Obtenir une clé API

1. Créez un compte sur [api.insee.fr](https://api.insee.fr)
2. Souscrivez à l'API Sirene (gratuite)
3. Récupérez votre clé API

### 2. Variables d'environnement

Créez un fichier `.env.local` :

```bash
# Clé API INSEE (obligatoire)
INSEE_API_KEY=votre_cle_api_ici

# Pour le développement (optionnel)
NEXT_PUBLIC_INSEE_API_KEY=votre_cle_api_ici
```

## 📁 Structure des fichiers

```
src/
├── types/
│   └── insee.ts                 # Types TypeScript
├── services/
│   └── insee.ts                 # Service de recherche
├── app/
│   └── api/
│       └── insee/
│           └── search/
│               └── route.ts     # Route API Next.js
└── components/
    └── entreprise-autocomplete.tsx  # Composant UI
```

## 🏗️ Types TypeScript

Créez `src/types/insee.ts` :

```typescript
/**
 * Types pour l'API INSEE Sirene
 */

export interface InseeEtablissement {
  siren: string
  siret: string
  dateCreationEtablissement: string
  trancheEffectifsEtablissement: string
  activitePrincipaleEtablissement: string
  nomenclatureActivitePrincipaleEtablissement: string
  denominationUsuelleEtablissement?: string
  adresseEtablissement: {
    complementAdresseEtablissement?: string
    numeroVoieEtablissement?: string
    indiceRepetitionEtablissement?: string
    typeVoieEtablissement?: string
    libelleVoieEtablissement?: string
    codePostalEtablissement: string
    libelleCommuneEtablissement: string
    codeCommuneEtablissement: string
  }
}

export interface InseeUniteLegale {
  siren: string
  statutDiffusionUniteLegale: string
  denominationUniteLegale?: string
  sigleUniteLegale?: string
  activitePrincipaleUniteLegale: string
  nomenclatureActivitePrincipaleUniteLegale: string
  categorieJuridiqueUniteLegale: string
  trancheEffectifsUniteLegale?: string
}

export interface InseeSirenResult {
  siren: string
  siret: string
  dateCreationEtablissement?: string
  trancheEffectifsEtablissement?: string
  activitePrincipaleEtablissement?: string
  nomenclatureActivitePrincipaleEtablissement?: string
  denominationUsuelleEtablissement?: string
  adresseEtablissement?: {
    complementAdresseEtablissement?: string
    numeroVoieEtablissement?: string
    indiceRepetitionEtablissement?: string
    typeVoieEtablissement?: string
    libelleVoieEtablissement?: string
    codePostalEtablissement: string
    libelleCommuneEtablissement: string
    codeCommuneEtablissement?: string
  }
  uniteLegale?: {
    siren?: string
    statutDiffusionUniteLegale?: string
    denominationUniteLegale?: string
    sigleUniteLegale?: string
    activitePrincipaleUniteLegale?: string
    nomenclatureActivitePrincipaleUniteLegale?: string
    categorieJuridiqueUniteLegale?: string
    trancheEffectifsUniteLegale?: string
  }
}

export interface InseeApiResponse {
  header: {
    statut: number
    message: string
    total: number
    debut: number
    nombre: number
  }
  etablissements?: InseeSirenResult[]
}

export interface EntrepriseSearchResult {
  siren: string
  siret: string
  raisonSociale: string
  nafApe: string
  tvaIntracom: string
  adresse: {
    voie: string
    codePostal: string
    ville: string
  }
}
```

## 🔍 Service de recherche

Créez `src/services/insee.ts` :

```typescript
import type { InseeApiResponse, EntrepriseSearchResult } from '@/types/insee'

const INSEE_API_BASE = 'https://api.insee.fr/api-sirene/3.11'
const REQUEST_TIMEOUT = 10000 // 10 secondes

/**
 * Construit le numéro de TVA intracommunautaire français
 */
function calculateTvaIntracom(siren: string): string {
  const sirenNumber = parseInt(siren, 10)
  const key = (12 + 3 * (sirenNumber % 97)) % 97
  return `FR${key.toString().padStart(2, '0')}${siren}`
}

/**
 * Recherche une entreprise par nom et code postal via l'API INSEE Sirene
 * Le code postal est optionnel mais recommandé pour affiner les résultats
 */
export async function searchEntrepriseByNameAndPostal(
  name: string,
  postalCode?: string,
  token?: string
): Promise<EntrepriseSearchResult[]> {
  // Validation des paramètres
  if (!name || name.trim().length < 2) {
    throw new Error('Le nom doit contenir au moins 2 caractères')
  }

  if (postalCode && !/^\d{5}$/.test(postalCode)) {
    throw new Error('Le code postal doit contenir 5 chiffres')
  }

  // Récupération de la clé API
  const apiKey =
    token || process.env.NEXT_PUBLIC_INSEE_API_KEY || process.env.INSEE_API_KEY

  if (!apiKey) {
    throw new Error('Clé API INSEE manquante')
  }

  // Construction de la requête
  const searchName = name.trim().toUpperCase().replace(/\s+/g, ' ')

  // Construction de la requête selon si code postal fourni ou non
  let query = `denominationUniteLegale:"${searchName}"`
  if (postalCode && postalCode.trim().length === 5) {
    query += ` AND codePostalEtablissement:${postalCode.trim()}`
  }

  const params = new URLSearchParams({
    q: query,
    nombre: '20', // Limiter à 20 résultats
  })

  const url = `${INSEE_API_BASE}/siret?${params.toString()}`

  try {
    // Requête avec timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-INSEE-Api-Key-Integration': apiKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Gestion des erreurs HTTP
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Clé API INSEE invalide ou expirée (401)')
      }
      if (response.status === 429) {
        throw new Error(
          "Trop de requêtes à l'API INSEE (429). Réessayez dans quelques instants."
        )
      }
      if (response.status === 404) {
        return [] // Aucun résultat trouvé
      }
      throw new Error(`Erreur API INSEE (${response.status})`)
    }

    const data: InseeApiResponse = await response.json()

    // Vérification de la réponse
    if (!data.etablissements || data.etablissements.length === 0) {
      return []
    }

    // Transformation des résultats
    return data.etablissements
      .filter((result) => result?.siren && result?.adresseEtablissement)
      .map((result) => {
        const adresse = result.adresseEtablissement

        if (!adresse) {
          return null
        }

        // Construction de l'adresse complète
        const voieParts = [
          adresse.numeroVoieEtablissement,
          adresse.indiceRepetitionEtablissement,
          adresse.typeVoieEtablissement,
          adresse.libelleVoieEtablissement,
        ].filter(Boolean)

        const voie = voieParts.join(' ').trim() || ''

        // Raison sociale
        const raisonSociale =
          result.uniteLegale?.denominationUniteLegale ||
          result.denominationUsuelleEtablissement ||
          result.uniteLegale?.sigleUniteLegale ||
          'Entreprise sans nom'

        // Code NAF/APE : prioriser l'établissement, sinon l'unité légale
        const nafApe =
          result.activitePrincipaleEtablissement ||
          result.uniteLegale?.activitePrincipaleUniteLegale ||
          ''

        return {
          siren: result.siren,
          siret: result.siret,
          raisonSociale,
          nafApe,
          tvaIntracom: calculateTvaIntracom(result.siren),
          adresse: {
            voie,
            codePostal: adresse.codePostalEtablissement || '',
            ville: adresse.libelleCommuneEtablissement || '',
          },
        }
      })
      .filter((result): result is NonNullable<typeof result> => result !== null)
  } catch (error) {
    // Gestion des erreurs
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré. Vérifiez votre connexion.')
      }
      throw error
    }
    throw new Error("Erreur lors de la recherche d'entreprise")
  }
}

/**
 * Recherche une entreprise par SIREN uniquement
 */
export async function searchEntrepriseBySiren(
  siren: string,
  token?: string
): Promise<EntrepriseSearchResult | null> {
  if (!siren || !/^\d{9}$/.test(siren)) {
    throw new Error('Le SIREN doit contenir 9 chiffres')
  }

  const apiKey =
    token || process.env.NEXT_PUBLIC_INSEE_API_KEY || process.env.INSEE_API_KEY

  if (!apiKey) {
    throw new Error('Clé API INSEE manquante')
  }

  const url = `${INSEE_API_BASE}/siret?q=siren:${siren}&nombre=1`

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-INSEE-Api-Key-Integration': apiKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Erreur API INSEE (${response.status})`)
    }

    const data: InseeApiResponse = await response.json()

    if (!data.etablissements || data.etablissements.length === 0) {
      return null
    }

    const result = data.etablissements[0]

    if (!result?.siren || !result?.adresseEtablissement) {
      return null
    }

    const adresse = result.adresseEtablissement

    if (!adresse) {
      return null
    }

    const voieParts = [
      adresse.numeroVoieEtablissement,
      adresse.indiceRepetitionEtablissement,
      adresse.typeVoieEtablissement,
      adresse.libelleVoieEtablissement,
    ].filter(Boolean)

    const voie = voieParts.join(' ').trim() || ''

    const raisonSociale =
      result.uniteLegale?.denominationUniteLegale ||
      result.denominationUsuelleEtablissement ||
      result.uniteLegale?.sigleUniteLegale ||
      'Entreprise sans nom'

    return {
      siren: result.siren,
      siret: result.siret,
      raisonSociale,
      nafApe: result.activitePrincipaleEtablissement || '',
      tvaIntracom: calculateTvaIntracom(result.siren),
      adresse: {
        voie,
        codePostal: adresse.codePostalEtablissement || '',
        ville: adresse.libelleCommuneEtablissement || '',
      },
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La requête a expiré')
      }
      throw error
    }
    throw new Error('Erreur lors de la recherche')
  }
}
```

## 🛣️ Route API Next.js

Créez `src/app/api/insee/search/route.ts` :

```typescript
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
```

## 🎨 Composant d'autocomplete

Créez `src/components/entreprise-autocomplete.tsx` :

```typescript
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Loader2, Building2, AlertCircle } from 'lucide-react'
import type { EntrepriseSearchResult } from '@/types/insee'

interface EntrepriseAutocompleteProps {
  onSelect: (entreprise: EntrepriseSearchResult) => void
  className?: string
}

/**
 * Composant d'autocomplete pour rechercher une entreprise via l'API INSEE
 */
export function EntrepriseAutocomplete({
  onSelect,
  className,
}: EntrepriseAutocompleteProps) {
  const [searchName, setSearchName] = useState('')
  const [searchPostal, setSearchPostal] = useState('')
  const [results, setResults] = useState<EntrepriseSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedEntreprise, setSelectedEntreprise] =
    useState<EntrepriseSearchResult | null>(null)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  /**
   * Fonction de recherche avec debounce
   */
  const performSearch = useCallback(async (name: string, postal: string) => {
    // Validation minimale - nom obligatoire, code postal optionnel
    if (name.trim().length < 2) {
      setResults([])
      setShowResults(false)
      setError(null)
      return
    }

    // Si code postal fourni, il doit être valide
    if (postal && postal.trim().length > 0 && postal.trim().length !== 5) {
      setError('Le code postal doit contenir 5 chiffres')
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Construire l'URL avec paramètres optionnels
      const params = new URLSearchParams({ name })
      if (postal && postal.trim().length === 5) {
        params.append('postalCode', postal.trim())
      }

      const response = await fetch(`/api/insee/search?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la recherche')
      }

      const data = await response.json()
      const searchResults = data.results || []

      setResults(searchResults)
      setShowResults(true)
      setSelectedIndex(-1)

      if (searchResults.length === 0) {
        setError('Aucune entreprise trouvée')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de recherche'
      setError(errorMessage)
      setResults([])
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Gestion du debounce (300ms)
   */
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchName, searchPostal)
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchName, searchPostal, performSearch])

  /**
   * Gestion de la sélection d'une entreprise
   */
  const handleSelect = (entreprise: EntrepriseSearchResult) => {
    onSelect(entreprise)
    setSelectedEntreprise(entreprise)
    setShowResults(false)
    setResults([])
    setError(null)
  }

  /**
   * Réinitialiser la recherche
   */
  const handleReset = () => {
    setSearchName('')
    setSearchPostal('')
    setSelectedEntreprise(null)
    setResults([])
    setError(null)
    setShowResults(false)
  }

  /**
   * Gestion de la navigation au clavier
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        break
    }
  }

  /**
   * Fermeture des résultats au clic extérieur
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`space-y-3 ${className || ''}`} ref={resultsRef}>
      {/* Message de succès */}
      {selectedEntreprise && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  Entreprise sélectionnée !
                </p>
                <p className="text-sm text-green-700 mt-1 font-semibold">
                  {selectedEntreprise.raisonSociale}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  SIRET: {selectedEntreprise.siret} • NAF:{' '}
                  {selectedEntreprise.nafApe || 'Non disponible'}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {selectedEntreprise.adresse.codePostal}{' '}
                  {selectedEntreprise.adresse.ville}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex-shrink-0 text-green-700 hover:text-green-900 text-sm font-medium underline ml-4"
            >
              Changer
            </button>
          </div>
        </div>
      )}

      {/* Formulaire de recherche */}
      {!selectedEntreprise && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h3 className="font-semibold text-base">Rechercher votre entreprise</h3>
          </div>

          <div className="relative">
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="search-name" className="text-sm font-medium">
                  Nom de l&apos;entreprise <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="search-name"
                    type="text"
                    placeholder="Tapez le nom de l'entreprise..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    aria-label="Nom de l'entreprise à rechercher"
                    aria-describedby={error ? 'search-error' : undefined}
                  />
                  {isLoading && (
                    <Loader2
                      className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              <div className="w-32 space-y-2">
                <label htmlFor="search-postal" className="text-sm font-medium">
                  Code postal
                </label>
                <input
                  id="search-postal"
                  type="text"
                  placeholder="75001"
                  value={searchPostal}
                  onChange={(e) => setSearchPostal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Code postal de l'entreprise (optionnel)"
                />
              </div>
            </div>

            {/* Résultats en position absolue */}
            {showResults && results.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 z-50 border rounded-lg bg-white shadow-xl max-h-96 overflow-auto"
                role="listbox"
                aria-label="Résultats de recherche d'entreprises"
              >
                <div className="p-2 bg-blue-50 border-b border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">
                    ✓ {results.length} résultat{results.length > 1 ? 's' : ''} trouvé
                    {results.length > 1 ? 's' : ''}
                  </p>
                </div>
                {results.map((entreprise, index) => (
                  <button
                    key={entreprise.siret}
                    type="button"
                    onClick={() => handleSelect(entreprise)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 focus:outline-none focus:bg-gray-50 ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <div className="flex items-start space-x-3">
                      <Building2
                        className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {entreprise.raisonSociale}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          SIRET: {entreprise.siret} • NAF: {entreprise.nafApe}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {entreprise.adresse.voie && `${entreprise.adresse.voie}, `}
                          {entreprise.adresse.codePostal} {entreprise.adresse.ville}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div
              id="search-error"
              className="flex items-start space-x-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Instructions */}
          {!showResults && !error && !isLoading && searchName.length === 0 && (
            <p className="text-xs text-gray-500 italic">
              Tapez au moins 2 caractères pour lancer la recherche. Le code postal est
              optionnel mais affine les résultats.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

## 📝 Utilisation dans un formulaire

Exemple d'utilisation dans un formulaire React Hook Form :

```typescript
import { useForm } from 'react-hook-form'
import { EntrepriseAutocomplete } from '@/components/entreprise-autocomplete'
import type { EntrepriseSearchResult } from '@/types/insee'

interface FormData {
  companyName: string
  siren: string
  siret: string
  // ... autres champs
}

export function MonFormulaire() {
  const { register, setValue, watch } = useForm<FormData>()

  const handleEntrepriseSelect = (entreprise: EntrepriseSearchResult) => {
    setValue('companyName', entreprise.raisonSociale)
    setValue('siren', entreprise.siren)
    setValue('siret', entreprise.siret)
    // ... remplir les autres champs
  }

  return (
    <form>
      <EntrepriseAutocomplete onSelect={handleEntrepriseSelect} />

      {/* Champs cachés ou en lecture seule */}
      <input {...register('companyName')} type="hidden" />
      <input {...register('siren')} type="hidden" />
      <input {...register('siret')} type="hidden" />
    </form>
  )
}
```

## ⚠️ Gestion des erreurs

### Types d'erreurs gérées

1. **Erreurs de validation** : Nom trop court, code postal invalide
2. **Erreurs d'API** : Clé manquante, quota dépassé, erreur serveur
3. **Erreurs réseau** : Timeout, connexion perdue
4. **Erreurs de données** : Réponse malformée, données manquantes

### Messages d'erreur utilisateur

- `"Le nom doit contenir au moins 2 caractères"`
- `"Le code postal doit contenir 5 chiffres"`
- `"Clé API INSEE manquante"`
- `"Trop de requêtes à l'API INSEE (429). Réessayez dans quelques instants."`
- `"La requête a expiré. Vérifiez votre connexion."`

## 🎯 Bonnes pratiques

### 1. Performance

- **Debounce** : 300ms pour éviter les requêtes excessives
- **Timeout** : 10 secondes maximum par requête
- **Limite de résultats** : 20 entreprises maximum
- **Cache** : Considérer un cache côté client pour les recherches récentes

### 2. Accessibilité

- **Navigation clavier** : Flèches, Entrée, Échap
- **ARIA** : Labels, descriptions, rôles appropriés
- **Focus management** : Gestion du focus lors de la sélection
- **Screen readers** : Messages d'état et d'erreur

### 3. UX

- **Feedback visuel** : Indicateur de chargement, états de sélection
- **Validation en temps réel** : Validation des champs au fur et à mesure
- **Messages clairs** : Instructions et erreurs compréhensibles
- **Responsive** : Adaptation mobile et desktop

### 4. Sécurité

- **Validation côté serveur** : Toujours valider les paramètres
- **Gestion des erreurs** : Ne pas exposer d'informations sensibles
- **Rate limiting** : Limiter les requêtes par utilisateur
- **Clés API** : Stocker en variables d'environnement

### 5. Maintenance

- **Logging** : Logger les erreurs pour le debugging
- **Monitoring** : Surveiller les performances de l'API
- **Tests** : Tests unitaires et d'intégration
- **Documentation** : Maintenir la documentation à jour

## 🚀 Déploiement

### Variables d'environnement de production

```bash
# Production
INSEE_API_KEY=votre_cle_api_production

# Staging (optionnel)
INSEE_API_KEY_STAGING=votre_cle_api_staging
```

### Configuration Vercel/Netlify

```bash
# Vercel
vercel env add INSEE_API_KEY

# Netlify
netlify env:set INSEE_API_KEY "votre_cle"
```

## 📊 Monitoring et métriques

### Métriques à surveiller

- Taux de succès des requêtes
- Temps de réponse moyen
- Nombre de requêtes par minute
- Erreurs 429 (quota dépassé)
- Erreurs 401 (clé invalide)

### Logs recommandés

```typescript
console.log('INSEE Search:', {
  name: searchName,
  postalCode: searchPostal,
  resultsCount: results.length,
  responseTime: Date.now() - startTime,
})
```

## 🔧 Personnalisation

### Modifier le délai de debounce

```typescript
// Dans le composant
debounceTimer.current = setTimeout(() => {
  performSearch(searchName, searchPostal)
}, 500) // 500ms au lieu de 300ms
```

### Changer le nombre de résultats

```typescript
// Dans le service
const params = new URLSearchParams({
  q: query,
  nombre: '50', // 50 résultats au lieu de 20
})
```

### Ajouter des champs de recherche

```typescript
// Ajouter un champ "Ville"
const [searchCity, setSearchCity] = useState('')

// Modifier la requête
let query = `denominationUniteLegale:"${searchName}"`
if (postalCode) query += ` AND codePostalEtablissement:${postalCode}`
if (searchCity) query += ` AND libelleCommuneEtablissement:"${searchCity}"`
```

---

Ce guide vous permet d'implémenter une recherche d'entreprises INSEE complète et robuste dans n'importe quel projet Next.js. L'implémentation est prête pour la production avec une gestion d'erreurs appropriée et une interface utilisateur accessible.
