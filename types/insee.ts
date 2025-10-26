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
