'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Mail, Clock, Phone, FileText, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'

interface ConfirmationPageProps {
  companyName?: string
  pdfBlob?: Blob | null
  onBack?: () => void
  onLogoClick?: () => void
}

/**
 * Page de confirmation après soumission réussie du formulaire
 */
export function ConfirmationPage({
  companyName,
  pdfBlob,
  onBack,
  onLogoClick,
}: ConfirmationPageProps) {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleDownloadPDF = () => {
    if (!pdfBlob) return

    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `demande-compte-professionnel-${companyName || 'xeilom'}-${
      new Date().toISOString().split('T')[0]
    }.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onBack={onBack} onLogoClick={onLogoClick} />

      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Animation de succès */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Demande reçue avec succès !
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 font-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Merci pour votre confiance,{' '}
            {companyName ? (
              <span className="font-medium text-blue-600">{companyName}</span>
            ) : (
              'entreprise'
            )}
            .
          </motion.p>
        </motion.div>

        {/* Informations sur les prochaines étapes */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border border-gray-200 hover:border-blue-200 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Délai de traitement
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Votre compte professionnel sera activé sous{' '}
                    <span className="font-medium text-blue-600">24 heures</span> après
                    validation de vos documents.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 hover:border-green-200 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email de confirmation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Un email de confirmation sera envoyé à l&apos;adresse fournie une fois
                    le compte activé.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Récapitulatif */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Prochaines étapes
          </h2>

          <ul className="space-y-4">
            {[
              {
                step: '1',
                title: 'Reception de votre dossier',
                description:
                  'Notre équipe réceptionne votre demande et les documents joints immédiatement.',
              },
              {
                step: '2',
                title: 'Vérification des informations',
                description:
                  'Nous vérifions vos informations légales et validons votre demande sous 24h.',
              },
              {
                step: '3',
                title: 'Activation de votre compte',
                description:
                  'Vous recevez un email de confirmation et pouvez passer commande dès réception.',
              },
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Une question sur votre demande ?
          </h3>
          <div className="flex items-center justify-center gap-8 mb-4">
            <a
              href="mailto:info.xeilom@xeilom.fr"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors no-underline"
            >
              <Mail className="h-5 w-5" />
              info.xeilom@xeilom.fr
            </a>
            <a
              href="tel:0365610420"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors no-underline"
            >
              <Phone className="h-5 w-5" />
              03 65 61 04 20
            </a>
          </div>
          <p className="text-sm text-gray-600">
            Notre équipe est disponible du lundi au vendredi, 9h-18h
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {pdfBlob && (
            <Button size="lg" variant="outline" onClick={handleDownloadPDF}>
              <FileText className="h-5 w-5 mr-2" />
              Télécharger le PDF
            </Button>
          )}
          <Button size="lg" onClick={handleGoHome}>
            <Home className="h-5 w-5 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
