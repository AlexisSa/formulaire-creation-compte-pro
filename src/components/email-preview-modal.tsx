'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail } from 'lucide-react'

interface EmailPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Modal de prévisualisation des emails envoyés automatiquement
 */
export function EmailPreviewModal({ open, onOpenChange }: EmailPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'team' | 'client'>('team')

  const sampleCompany = {
    name: 'SARL EXEMPLE',
    siren: '123456789',
    siret: '12345678900001',
    nafApe: '6201Z',
    tvaIntracom: 'FR12345678901',
    address: '123 Rue de la République',
    postalCode: '75001',
    city: 'Paris',
    deliveryAddress: '123 Rue de la République',
    deliveryPostalCode: '75001',
    deliveryCity: 'Paris',
  }

  const sampleContacts = {
    achatEmail: 'achat@exemple.fr',
    achatPhone: '01 23 45 67 89',
    comptaEmail: 'compta@exemple.fr',
    comptaPhone: '01 23 45 67 90',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Prévisualisation des emails
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'team'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email à l'équipe XEILOM
          </button>
          <button
            onClick={() => setActiveTab('client')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'client'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Email au client
          </button>
        </div>

        {/* Email Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeTab === 'team' ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>De:</strong> noreply@xeilom.fr
                  <br />
                  <strong>À:</strong> communication@xeilom.fr
                  <br />
                  <strong>Objet:</strong> 🎯 Nouvelle demande de compte professionnel -{' '}
                  {sampleCompany.name}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg text-center">
                  <h2 className="text-xl font-bold mb-2">
                    🎯 Nouvelle demande de compte professionnel
                  </h2>
                  <p className="opacity-90">XEILOM</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                    <p className="font-semibold text-gray-900 mb-3">
                      Une nouvelle demande de création de compte professionnel a été
                      soumise.
                    </p>

                    <h3 className="font-semibold text-blue-600 mb-2">
                      Informations de l'entreprise
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Nom:</strong> {sampleCompany.name}
                      </p>
                      <p>
                        <strong>SIREN:</strong> {sampleCompany.siren}
                      </p>
                      <p>
                        <strong>SIRET:</strong> {sampleCompany.siret}
                      </p>
                      <p>
                        <strong>NAF/APE:</strong> {sampleCompany.nafApe}
                      </p>
                      <p>
                        <strong>Adresse:</strong> {sampleCompany.address},{' '}
                        {sampleCompany.postalCode} {sampleCompany.city}
                      </p>
                    </div>

                    <h3 className="font-semibold text-blue-600 mb-2 mt-4">Contacts</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Responsable Achat:</strong> {sampleContacts.achatEmail},{' '}
                        {sampleContacts.achatPhone}
                      </p>
                      <p>
                        <strong>Service Comptabilité:</strong>{' '}
                        {sampleContacts.comptaEmail}, {sampleContacts.comptaPhone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 text-sm">
                    <strong>📎 Documents en pièce jointe:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• KBIS (kbis.pdf)</li>
                      <li>• PDF récapitulatif complet de la demande</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <p className="text-xs text-gray-600">
                  <strong>De:</strong> noreply@xeilom.fr
                  <br />
                  <strong>À:</strong> {sampleContacts.achatEmail}
                  <br />
                  <strong>Cc:</strong> {sampleContacts.comptaEmail}
                  <br />
                  <strong>Objet:</strong> ✅ Votre demande de compte professionnel XEILOM
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center">
                  <img
                    src="https://www.xeilom.fr/Files/126457/Img/23/logo-quadri-hd-scaled-removebg-preview.png"
                    alt="XEILOM"
                    className="max-w-48 h-auto mx-auto mb-4"
                  />
                  <h1 className="text-2xl font-bold mb-2">✅ Demande reçue !</h1>
                  <p className="opacity-90">Merci pour votre confiance</p>
                </div>

                <div className="space-y-4">
                  <p className="text-base text-gray-700">
                    Bonjour,
                    <br />
                    <br />
                    Votre demande de compte professionnel chez{' '}
                    <strong>{sampleCompany.name}</strong> a bien été reçue par notre
                    équipe.
                  </p>

                  <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900 mb-3">
                      📋 Prochaines étapes :
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>
                        • Votre demande sera traitée sous <strong>24 heures</strong>
                      </li>
                      <li>
                        • Vous recevrez un email de confirmation dès l'activation de votre
                        compte
                      </li>
                      <li>
                        • Vous pourrez alors accéder à nos tarifs professionnels et passer
                        commande
                      </li>
                    </ul>
                  </div>

                  <div className="text-center py-4">
                    <a
                      href="#"
                      className="inline-block px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold"
                    >
                      🛒 Visiter notre boutique en ligne
                    </a>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-semibold text-gray-900 mb-2">💬 Une question ?</p>
                    <p className="text-gray-600">
                      Notre équipe est disponible du lundi au vendredi, de 9h à 18h
                    </p>
                    <p className="text-gray-600">
                      📧 info.xeilom@xeilom.fr
                      <br />
                      📞 03 65 61 04 20
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
