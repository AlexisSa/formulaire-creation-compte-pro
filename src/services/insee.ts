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
  // Recherche par dénomination, optionnellement avec code postal
  const searchName = name.trim().toUpperCase().replace(/\s+/g, ' ')

  // Construction de la requête selon si code postal fourni ou non
  // Recherche flexible sans guillemets pour permettre la recherche par préfixe
  let query = `denominationUniteLegale:${searchName}`
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
        // L'API renvoie directement les données, pas dans etablissement/uniteLegale
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
