'use client'

import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/file-upload'
import { SignaturePad } from '@/components/signature-pad'
import { FileText, PenTool, HelpCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CGVModal } from '@/components/cgv-modal'

interface Step3DocumentsProps {
  form: UseFormReturn<AccountFormData>
}

/**
 * Étape 3 : Documents et signature
 */
export function Step3Documents({ form }: Step3DocumentsProps) {
  const [isCGVOpen, setIsCGVOpen] = useState(false)

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
      {/* Section 1: Signature + Conditions */}
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
              <button
                type="button"
                onClick={() => setIsCGVOpen(true)}
                className="text-blue-600 underline font-medium hover:text-blue-700"
              >
                CGV disponibles ici
              </button>
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

        {/* Section document (optionnelle) */}
        <div className="border border-gray-200 rounded-lg px-4 py-2 flex gap-2 items-start bg-white">
          <FileText className="h-4 w-4 text-gray-400 mt-1" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-800 mb-2">
              Joindre un KBIS si souhaité (optionnel)
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Vous pouvez accélérer la validation de votre dossier en ajoutant un KBIS
              récent (PDF/JPG/PNG, &lt; 5 Mo), mais ce n&apos;est pas obligatoire.
            </div>
            <FileUpload
              value={legalDocument}
              onFileChange={(file) => {
                setValue('legalDocument', file as any, { shouldValidate: false })
              }}
              error={errors.legalDocument?.message}
              maxSize={5 * 1024 * 1024}
            />
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

      {/* CGV Modal */}
      <CGVModal open={isCGVOpen} onOpenChange={setIsCGVOpen} />
    </div>
  )
}
