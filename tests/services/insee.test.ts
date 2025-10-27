import {
  searchEntrepriseByNameAndPostal,
  searchEntrepriseBySiren,
} from '@/services/insee'

// Mock fetch
global.fetch = jest.fn()

describe('Service INSEE', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchEntrepriseByNameAndPostal', () => {
    it("valide les paramètres d'entrée", async () => {
      await expect(
        searchEntrepriseByNameAndPostal('', '75001', 'test-token')
      ).rejects.toThrow('Le nom doit contenir au moins 2 caractères')

      await expect(
        searchEntrepriseByNameAndPostal('ACME', '123', 'test-token')
      ).rejects.toThrow('Le code postal doit contenir 5 chiffres')
    })

    it('rejette si la clé API est manquante', async () => {
      // Supprimer les variables d'environnement
      const oldEnv = process.env.INSEE_API_KEY
      delete process.env.INSEE_API_KEY
      delete process.env.NEXT_PUBLIC_INSEE_API_KEY

      await expect(searchEntrepriseByNameAndPostal('ACME', '75001')).rejects.toThrow(
        'Clé API INSEE manquante'
      )

      // Restaurer
      if (oldEnv) process.env.INSEE_API_KEY = oldEnv
    })

    it('retourne un tableau vide si aucun résultat', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          header: { statut: 200, message: 'OK', total: 0, debut: 0, nombre: 0 },
          etablissements: [],
        }),
      })

      const results = await searchEntrepriseByNameAndPostal('ACME', '75001', 'test-token')
      expect(results).toEqual([])
    })

    it("transforme correctement les résultats de l'API", async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          header: { statut: 200, message: 'OK', total: 1, debut: 0, nombre: 1 },
          etablissements: [
            {
              siren: '123456789',
              siret: '12345678901234',
              dateCreationEtablissement: '2020-01-01',
              trancheEffectifsEtablissement: '00',
              activitePrincipaleEtablissement: '62.01Z',
              nomenclatureActivitePrincipaleEtablissement: 'NAFRev2',
              adresseEtablissement: {
                numeroVoieEtablissement: '1',
                typeVoieEtablissement: 'RUE',
                libelleVoieEtablissement: 'DE LA PAIX',
                codePostalEtablissement: '75001',
                libelleCommuneEtablissement: 'PARIS',
                codeCommuneEtablissement: '75101',
              },
              uniteLegale: {
                siren: '123456789',
                statutDiffusionUniteLegale: 'O',
                denominationUniteLegale: 'ACME CORP',
                activitePrincipaleUniteLegale: '62.01Z',
                nomenclatureActivitePrincipaleUniteLegale: 'NAFRev2',
                categorieJuridiqueUniteLegale: '5710',
              },
            },
          ],
        }),
      })

      const results = await searchEntrepriseByNameAndPostal('ACME', '75001', 'test-token')

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({
        siren: '123456789',
        siret: '12345678901234',
        raisonSociale: 'ACME CORP',
        nafApe: '62.01Z',
        adresse: {
          voie: '1 RUE DE LA PAIX',
          codePostal: '75001',
          ville: 'PARIS',
        },
      })
      expect(results[0].tvaIntracom).toMatch(/^FR\d{11}$/)
    })

    it('gère les erreurs 401', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      await expect(
        searchEntrepriseByNameAndPostal('ACME', '75001', 'invalid-token')
      ).rejects.toThrow('Clé API INSEE invalide ou expirée (401)')
    })

    it('gère les erreurs 429', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      await expect(
        searchEntrepriseByNameAndPostal('ACME', '75001', 'test-token')
      ).rejects.toThrow('Trop de requêtes')
    })
  })

  describe('searchEntrepriseBySiren', () => {
    it('valide le format du SIREN', async () => {
      await expect(searchEntrepriseBySiren('12345', 'test-token')).rejects.toThrow(
        'Le SIREN doit contenir 9 chiffres'
      )
    })

    it('retourne null si aucune entreprise trouvée', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await searchEntrepriseBySiren('123456789', 'test-token')
      expect(result).toBeNull()
    })
  })
})
