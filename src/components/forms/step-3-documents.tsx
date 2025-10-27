'use client'

import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/file-upload'
import { SignaturePad } from '@/components/signature-pad'
import { FileText, PenTool, HelpCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Step3DocumentsProps {
  form: UseFormReturn<AccountFormData>
}

/**
 * Étape 3 : Documents et signature
 */
export function Step3Documents({ form }: Step3DocumentsProps) {
  const {
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = form

  const legalDocument = watch('legalDocument')

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async () => {
    try {
      const { generateAccountPDF } = await import('@/lib/pdf-generator')
      const data = getValues()

      // Générer le PDF
      const pdfBlob = await generateAccountPDF(data)

      // Créer le lien de téléchargement
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url

      // Nom du fichier avec le nom de l'entreprise
      const companyName = data.companyName || 'xeilom'
      const date = new Date().toISOString().split('T')[0]
      link.download = `demande-compte-${companyName.replace(
        /[^a-zA-Z0-9]/g,
        '-'
      )}-${date}.pdf`

      // Télécharger
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Nettoyer l'URL
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Une erreur est survenue lors de la génération du PDF.')
    }
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Document légal */}
      <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Justificatif d&apos;entreprise <span className="text-red-600">*</span>
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Kbis de moins de 3 mois, statuts, ou inscription au registre des métiers • PDF,
          PNG, JPG • Max 5 MB
        </p>

        <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Comment obtenir votre Kbis ?
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Le Kbis est votre extrait d&apos;immatriculation au Registre du Commerce
                et des Sociétés (RCS). Vous pouvez le télécharger gratuitement sur{' '}
                <a
                  href="https://www.infogreffe.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium hover:text-blue-700"
                >
                  infogreffe.fr
                </a>{' '}
                ou{' '}
                <a
                  href="https://www.societe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium hover:text-blue-700"
                >
                  societe.com
                </a>{' '}
                en recherchant votre entreprise par nom ou numéro SIREN.
              </p>
            </div>
          </div>
        </div>

        <FileUpload
          value={legalDocument}
          onFileChange={(file) => {
            setValue('legalDocument', file as any, { shouldValidate: true })
          }}
          error={errors.legalDocument?.message}
          maxSize={5 * 1024 * 1024} // 5 MB
        />
      </div>

      {/* Section 2: Signature + Conditions */}
      <div className="space-y-6">
        {/* Signature */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Signature des CGV <span className="text-red-600">*</span>
            </h3>
          </div>

          <p className="text-sm text-gray-600">
            En signant, vous acceptez les conditions générales de vente Xeilom
          </p>

          <SignaturePad
            onSave={(signature) =>
              setValue('signature', signature, { shouldValidate: true })
            }
            error={errors.signature?.message}
          />

          {/* Info CGV */}
          <div className="bg-white border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-gray-900 mb-2">
              📋 Conditions Générales de Vente
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Votre signature électronique a la même valeur juridique qu&apos;une
              signature manuscrite (règlement eIDAS). En signant, vous reconnaissez avoir
              pris connaissance et accepter nos{' '}
              <Link
                href="/cgv"
                className="text-blue-600 underline font-medium hover:text-blue-700"
              >
                CGV disponibles ici
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Conditions de règlement */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Conditions de règlement
            </h3>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-medium">
              <span className="text-gray-900 font-semibold">1ère commande :</span>{' '}
              Règlement avant expédition de marchandise
            </p>
            <p>
              <span className="text-gray-900 font-semibold">Autres commandes :</span>{' '}
              Après ouverture du compte client professionnel, et après acceptation de
              notre service financier, le règlement des matériels pourra s&apos;effectuer
              à 30 jours fin de mois
            </p>
          </div>
        </div>

        {/* Téléchargement PDF */}
        <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Télécharger votre formulaire
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Téléchargez un PDF récapitulatif de votre demande avant de finaliser. Ce
                document contient toutes les informations que vous avez saisies.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadPDF}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
