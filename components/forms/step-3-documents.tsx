'use client'

import { UseFormReturn } from 'react-hook-form'
import { AccountFormData } from '@/lib/validation'
import { Label } from '@/components/ui/label'
import { FileUpload } from '@/components/file-upload'
import { SignaturePad } from '@/components/signature-pad'
import { FileText, PenTool, HelpCircle } from 'lucide-react'

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
    formState: { errors },
  } = form

  const legalDocument = watch('legalDocument')

  return (
    <div className="space-y-8">
      {/* Document légal */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Justificatif d&apos;entreprise <span className="text-red-600">*</span>
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Kbis de moins de 3 mois, statuts, ou inscription au registre des métiers • PDF,
          PNG, JPG • Max 5 MB
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">
                Comment obtenir votre Kbis ?
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Le Kbis est votre extrait d&apos;immatriculation au Registre du Commerce
                et des Sociétés (RCS). Vous pouvez le télécharger gratuitement sur{' '}
                <a
                  href="https://www.infogreffe.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-amber-900"
                >
                  infogreffe.fr
                </a>{' '}
                ou{' '}
                <a
                  href="https://www.societe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-amber-900"
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

      {/* Signature */}
      <div className="space-y-5 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <PenTool className="h-4 w-4 text-blue-600" />
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
      </div>

      {/* Info CGV */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 mt-6">
        <p className="text-sm font-medium text-blue-900">
          📋 Conditions Générales de Vente
        </p>
        <p className="text-sm text-blue-800 leading-relaxed">
          Votre signature électronique a la même valeur juridique qu&apos;une signature
          manuscrite (règlement eIDAS). En signant, vous reconnaissez avoir pris
          connaissance et accepter nos{' '}
          <a href="#" className="underline font-medium hover:text-blue-900">
            CGV disponibles ici
          </a>
          .
        </p>
      </div>
    </div>
  )
}
