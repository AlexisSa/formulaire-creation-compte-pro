'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Stepper } from '@/components/ui/stepper'
import { Step1Company } from '@/components/forms/step-1-company'
import { Step2Contact } from '@/components/forms/step-2-contact'
import { Step3Documents } from '@/components/forms/step-3-documents'
import { EntrepriseAutocomplete } from '@/components/entreprise-autocomplete'
import {
  AutoSaveNotification,
  SaveIndicator,
} from '@/components/ui/auto-save-notification'
import { StepTransition } from '@/components/ui/step-transition'
import { SaveNotification } from '@/components/ui/feedback'
import { accountFormSchema, type AccountFormData } from '@/lib/validation'
import { useAutoSave, useProgressAnimation } from '@/hooks'
import { useToast } from '@/contexts/ToastContext'
import { ConfirmationPage } from '@/components/confirmation-page'
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Votre Entreprise', description: 'Identification' },
  { id: 2, title: 'Contact', description: 'Coordonnées' },
  { id: 3, title: 'Validation', description: 'Documents' },
]

interface AccountFormProps {
  onBack?: () => void
  onLogoClick?: () => void
}

/**
 * Formulaire de création de compte professionnel en plusieurs étapes
 */
export function AccountForm({ onBack, onLogoClick }: AccountFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>(
    'forward'
  )
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedCompanyName, setSubmittedCompanyName] = useState<string>('')

  const { showToast } = useToast()

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    mode: 'onChange',
    defaultValues: {
      siren: '',
      nafApe: '',
      tvaIntracom: '',
    },
  })

  // Hook de sauvegarde automatique
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useAutoSave({
    form,
    debounceMs: 2000,
    enabled: true,
  })

  // Hook d'animation de progression
  const { progress, animateTo } = useProgressAnimation(0)

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form

  // Animation de progression au changement d'étape
  useEffect(() => {
    const progressPercentage = (currentStep / STEPS.length) * 100
    animateTo(progressPercentage, 800)
  }, [currentStep, animateTo])

  // Chargement du brouillon au montage
  useEffect(() => {
    if (hasDraft()) {
      const draftData = loadDraft()
      if (draftData) {
        // Charger les données dans le formulaire
        Object.entries(draftData).forEach(([key, value]) => {
          if (value !== undefined && key !== '_timestamp') {
            setValue(key as keyof AccountFormData, value as any)
          }
        })
      }
    }
  }, [hasDraft, loadDraft, setValue])

  /**
   * Scroll vers le stepper avec animation douce
   */
  const scrollToStepper = () => {
    setTimeout(() => {
      const stepperElement = document.getElementById('form-stepper')
      if (stepperElement) {
        const yOffset = -20 // 20px au-dessus du stepper
        const y =
          stepperElement.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
      }
    }, 150)
  }

  /**
   * Validation d'une étape spécifique
   */
  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: (keyof AccountFormData)[][] = [
      [
        'companyName',
        'siren',
        'siret',
        'nafApe',
        'tvaIntracom',
        'address',
        'postalCode',
        'city',
      ],
      ['email', 'phone'],
      ['legalDocument', 'signature'],
    ]

    const fields = fieldsToValidate[step - 1] || []
    const result = await trigger(fields as any)
    return result
  }

  /**
   * Passage à l'étape suivante
   */
  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid && currentStep < STEPS.length) {
      setTransitionDirection('forward')
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        scrollToStepper()
        setTimeout(() => setIsTransitioning(false), 400)
      }, 200)
    }
  }

  /**
   * Retour à l'étape précédente
   */
  const handlePrevious = () => {
    if (currentStep > 1) {
      setTransitionDirection('backward')
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        scrollToStepper()
        setTimeout(() => setIsTransitioning(false), 400)
      }, 200)
    }
  }

  /**
   * Navigation vers une étape spécifique (uniquement les étapes déjà visitées)
   */
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep && stepNumber !== currentStep) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(stepNumber)
        scrollToStepper()
        setTimeout(() => setIsTransitioning(false), 400)
      }, 200)
    }
  }

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: AccountFormData) => {
    try {
      setIsSaving(true)

      // Import dynamique pour éviter le chargement côté serveur
      const { generateAccountPDF } = await import('@/lib/pdf-generator')

      // Générer le PDF avec toutes les informations
      const pdfBlob = await generateAccountPDF(data)

      // Télécharger le PDF
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `demande-compte-professionnel-${data.companyName || 'xeilom'}-${
        new Date().toISOString().split('T')[0]
      }.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Fonction de compression (comme définit dans pako mais en pur JS)
      const compressData = async (data: Blob): Promise<string> => {
        // Utiliser la Compression Streams API si disponible
        if ('CompressionStream' in window) {
          try {
            const stream = data.stream()
            const compressedStream = stream.pipeThrough(new CompressionStream('gzip'))
            const compressedBlob = await new Response(compressedStream).blob()
            const arrayBuffer = await compressedBlob.arrayBuffer()
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i])
            }
            return btoa(binary)
          } catch (error) {
            console.warn('Compression failed, sending uncompressed:', error)
          }
        }
        // Fallback: pas de compression
        const arrayBuffer = await data.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return btoa(binary)
      }

      // Convertir et compresser le PDF
      const pdfBase64 = await compressData(pdfBlob)
      const pdfFileName = `recapitulatif-${data.companyName || 'xeilom'}-${
        new Date().toISOString().split('T')[0]
      }.pdf`

      // Vérifier la taille du PDF généré (max 10 MB non compressé)
      const pdfSizeMB = pdfBlob.size / 1024 / 1024
      if (pdfSizeMB > 10) {
        throw new Error(
          `Le PDF généré est trop volumineux (${pdfSizeMB.toFixed(
            2
          )} MB). Taille maximum : 10 MB.`
        )
      }

      console.log(`📄 PDF: ${pdfFileName}, Taille: ${pdfSizeMB.toFixed(2)} MB`)

      // Convertir et compresser le fichier KBIS
      let kbisBase64 = ''
      let kbisFileName = ''
      if (data.legalDocument) {
        // Vérifier la taille du KBIS (max 5 MB non compressé)
        const kbisSizeMB = data.legalDocument.size / 1024 / 1024
        if (kbisSizeMB > 5) {
          throw new Error(
            `Le fichier KBIS est trop volumineux (${kbisSizeMB.toFixed(
              2
            )} MB). Taille maximum : 5 MB.`
          )
        }

        kbisFileName = data.legalDocument.name
        kbisBase64 = await compressData(data.legalDocument)

        console.log(`📎 KBIS: ${kbisFileName}, Taille: ${kbisSizeMB.toFixed(2)} MB`)
      }

      // Envoyer les emails
      try {
        const emailPayload = {
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          kbisFile: kbisBase64,
          kbisFileName: kbisFileName,
          pdfFile: pdfBase64,
          pdfFileName: pdfFileName,
          signature: data.signature,
          companyInfo: {
            siren: data.siren,
            siret: data.siret,
            nafApe: data.nafApe,
            tvaIntracom: data.tvaIntracom,
            address: data.address,
            postalCode: data.postalCode,
            city: data.city,
          },
        }

        const payloadSize = new Blob([JSON.stringify(emailPayload)]).size
        const payloadSizeMB = payloadSize / 1024 / 1024
        console.log(`📦 [CLIENT] Payload size: ${payloadSizeMB.toFixed(2)} MB`)

        // Vérification de taille finale après compression (limite : 8 MB)
        if (payloadSize > 8 * 1024 * 1024) {
          console.error(
            '❌ [CLIENT] Payload too large after compression!',
            payloadSize,
            'bytes'
          )
          throw new Error(
            `Les fichiers sont trop volumineux (${payloadSizeMB.toFixed(
              2
            )} MB). Taille maximum après compression : 8 MB. Veuillez réduire la taille des fichiers.`
          )
        }

        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        })

        if (!emailResponse.ok) {
          console.error("Erreur lors de l'envoi des emails")
        }
      } catch (emailError) {
        // Ne pas bloquer la soumission si l'email échoue
        console.error('Erreur email:', emailError)
      }

      // Nettoyer le brouillon après soumission réussie
      clearDraft()

      // Sauvegarder le nom de l'entreprise pour l'affichage sur la page de confirmation
      setSubmittedCompanyName(data.companyName)

      // Afficher un toast de succès
      showToast('success', 'Formulaire soumis avec succès', 'Le PDF a été téléchargé')

      // Rediriger vers la page de confirmation après un court délai
      setTimeout(() => {
        setShowConfirmation(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 1000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      showToast(
        'error',
        'Erreur lors de la soumission',
        `Impossible de générer le PDF : ${errorMessage}`
      )
    } finally {
      setIsSaving(false)
    }
  }

  // Afficher la page de confirmation
  if (showConfirmation) {
    return (
      <ConfirmationPage
        companyName={submittedCompanyName}
        onBack={() => {
          // Réinitialiser et retourner au formulaire
          setShowConfirmation(false)
          setCurrentStep(1)
          reset()
        }}
        onLogoClick={onLogoClick}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <Header onBack={onBack} onLogoClick={onLogoClick} />

      {/* Indicateur de sauvegarde */}
      <SaveIndicator isSaving={isSaving} />

      {/* Notification de sauvegarde automatique */}
      <AutoSaveNotification
        isVisible={showSaveNotification}
        message="Progression sauvegardée"
      />

      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* En-tête */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Créez votre compte en
            <br />
            <span className="text-blue-600">quelques étapes</span>
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Remplissez le formulaire ci-dessous pour accéder à nos tarifs préférentiels et
            à nos services d&apos;expertise en courant faible
          </motion.p>
        </motion.div>

        {/* Stepper */}
        <motion.div
          id="form-stepper"
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          />
        </motion.div>

        {/* Recherche entreprise - visible uniquement à l'étape 1 */}
        {currentStep === 1 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recherche automatique
                  </h3>
                  <p className="text-sm text-gray-600">
                    Utilisez notre outil pour remplir automatiquement les informations
                    légales
                  </p>
                </div>
              </div>
              <EntrepriseAutocomplete
                onSelect={(entreprise) => {
                  form.setValue('companyName', entreprise.raisonSociale, {
                    shouldValidate: true,
                  })
                  form.setValue('siren', entreprise.siren, { shouldValidate: true })
                  form.setValue('siret', entreprise.siret, { shouldValidate: true })
                  form.setValue('nafApe', entreprise.nafApe, { shouldValidate: true })
                  form.setValue('tvaIntracom', entreprise.tvaIntracom, {
                    shouldValidate: true,
                  })
                  form.setValue('address', entreprise.adresse.voie, {
                    shouldValidate: true,
                  })
                  form.setValue('postalCode', entreprise.adresse.codePostal, {
                    shouldValidate: true,
                  })
                  form.setValue('city', entreprise.adresse.ville, {
                    shouldValidate: true,
                  })
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative"
        >
          {/* Overlay de chargement */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white/90 rounded-xl z-10 flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-700 font-medium">Chargement...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Contenu de l'étape */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {currentStep === 1 && <Step1Company form={form} />}
                    {currentStep === 2 && <Step2Contact form={form} />}
                    {currentStep === 3 && <Step3Documents form={form} />}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <motion.div
                  className="flex justify-between items-center pt-8 border-t border-gray-200 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  {/* Bouton précédent */}
                  <div className="flex-1">
                    {currentStep > 1 && (
                      <Button type="button" variant="outline" onClick={handlePrevious}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Précédent
                      </Button>
                    )}
                  </div>

                  {/* Indicateur d'étape */}
                  <div className="flex-1 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Étape {currentStep} sur {STEPS.length}
                    </span>
                  </div>

                  {/* Bouton suivant ou soumettre */}
                  <div className="flex-1 flex justify-end">
                    {currentStep < STEPS.length ? (
                      <Button type="button" onClick={handleNext} variant="default">
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting} variant="default">
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Faire ma demande de compte pro
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Aide */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.p className="text-gray-700 mb-2">
            Une question ? Notre équipe est là pour vous aider
          </motion.p>
          <motion.a
            href="mailto:info.xeilom@xeilom.fr"
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors no-underline"
          >
            info.xeilom@xeilom.fr
          </motion.a>
        </motion.div>

        {/* Message discret sur la sauvegarde automatique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
            <Save className="w-4 h-4 text-blue-600" />
            <span>
              Vos données sont automatiquement sauvegardées pour vous faire gagner du
              temps si vous souhaitez reprendre plus tard
            </span>
          </div>
        </motion.div>
      </div>

      {/* Notification de sauvegarde améliorée */}
      <SaveNotification
        isVisible={showSaveNotification}
        isSaving={isSaving}
        onClose={() => setShowSaveNotification(false)}
      />
    </div>
  )
}
