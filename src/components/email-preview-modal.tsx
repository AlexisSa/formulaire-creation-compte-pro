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
              
              {/* Email Preview - Structure Outlook compatible */}
              <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
                <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={{ backgroundColor: '#2563eb', padding: '30px 20px', textAlign: 'center' }}>
                        <h1 style={{ margin: 0, color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
                          🎯 Nouvelle demande de compte professionnel
                        </h1>
                        <p style={{ margin: '10px 0 0 0', color: '#e0e7ff', fontSize: '14px' }}>XEILOM</p>
                      </td>
                    </tr>
                    
                    {/* Content */}
                    <tr>
                      <td style={{ backgroundColor: '#f9fafb', padding: '30px 20px', border: '1px solid #e5e7eb' }}>
                        <p style={{ margin: '0 0 25px 0', fontSize: '16px', lineHeight: '1.6' }}>
                          <strong>Une nouvelle demande de création de compte professionnel a été soumise.</strong>
                        </p>
                        
                        {/* Spacer */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '15px', lineHeight: '15px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <h2 style={{ color: '#1e40af', fontSize: '18px', borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginTop: 0, marginBottom: 0 }}>
                          Informations de l'entreprise
                        </h2>
                        
                        {/* Spacer */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '10px', lineHeight: '10px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderLeft: '4px solid #2563eb' }}>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Nom :</strong> {sampleCompany.name}
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>SIREN :</strong> {sampleCompany.siren}
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>SIRET :</strong> {sampleCompany.siret}
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>NAF/APE :</strong> {sampleCompany.nafApe}
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Adresse :</strong> {sampleCompany.address}, {sampleCompany.postalCode} {sampleCompany.city}
                          </p>
                        </div>
                        
                        {/* Spacer entre sections */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '20px', lineHeight: '20px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <h2 style={{ color: '#1e40af', fontSize: '18px', borderBottom: '2px solid #2563eb', paddingBottom: '10px', marginTop: 0, marginBottom: 0 }}>
                          Contacts
                        </h2>
                        
                        {/* Spacer */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '10px', lineHeight: '10px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderLeft: '4px solid #2563eb' }}>
                          <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#1e40af', fontSize: '14px' }}>
                            Responsable Achat
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Email :</strong> {sampleContacts.achatEmail}
                          </p>
                          <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Téléphone :</strong> {sampleContacts.achatPhone}
                          </p>
                          
                          <p style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', margin: '0 0 12px 0', fontWeight: 'bold', color: '#1e40af', fontSize: '14px' }}>
                            Service Comptabilité
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Email :</strong> {sampleContacts.comptaEmail}
                          </p>
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
                            <strong style={{ color: '#1e40af' }}>Téléphone :</strong> {sampleContacts.comptaPhone}
                          </p>
                        </div>
                        
                        {/* Spacer entre sections */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '20px', lineHeight: '20px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ backgroundColor: '#dbeafe', padding: '20px', borderLeft: '4px solid #2563eb' }}>
                          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.8' }}>
                            <strong>📎 Documents en pièce jointe :</strong><br />
                            • KBIS (kbis.pdf)<br />
                            • PDF récapitulatif complet de la demande
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: '#f3f4f6', padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                        <p style={{ margin: '0 0 8px 0' }}>
                          Email envoyé automatiquement depuis le formulaire de création de compte professionnel XEILOM
                        </p>
                        <p style={{ margin: 0 }}>© {new Date().getFullYear()} XEILOM - Distributeur & Fabricant Courant Faible</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
              
              {/* Email Preview - Structure Outlook compatible */}
              <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
                <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td style={{ backgroundColor: '#2563eb', padding: '40px 20px', textAlign: 'center' }}>
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: '20px' }}>
                                <img
                                  src="https://www.xeilom.fr/Files/126457/Img/23/logo-quadri-hd-scaled-removebg-preview.png"
                                  alt="XEILOM"
                                  width="200"
                                  style={{ maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <h1 style={{ margin: 0, color: '#ffffff', fontSize: '28px', fontWeight: 'bold' }}>
                                  ✅ Demande reçue !
                                </h1>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingTop: '10px' }}>
                                <p style={{ margin: 0, color: '#e0e7ff', fontSize: '16px' }}>Merci pour votre confiance</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    
                    {/* Content */}
                    <tr>
                      <td style={{ backgroundColor: '#f9fafb', padding: '40px 20px', border: '1px solid #e5e7eb' }}>
                        <p style={{ margin: '0 0 25px 0', fontSize: '18px', lineHeight: '1.8' }}>
                          Bonjour,
                          <br />
                          <br />
                          Votre demande de compte professionnel chez <strong>{sampleCompany.name}</strong> a bien été reçue par notre équipe.
                        </p>
                        
                        {/* Spacer */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '15px', lineHeight: '15px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ backgroundColor: '#dbeafe', padding: '25px', borderLeft: '4px solid #2563eb' }}>
                          <p style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>
                            📋 Prochaines étapes :
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#333333', lineHeight: '1.6' }}>
                            • Votre demande sera traitée sous <strong>24 heures</strong>
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#333333', lineHeight: '1.6' }}>
                            • Vous recevrez un email de confirmation dès l'activation de votre compte
                          </p>
                          <p style={{ margin: 0, fontSize: '15px', color: '#333333', lineHeight: '1.6' }}>
                            • Vous pourrez alors accéder à nos tarifs professionnels et passer commande
                          </p>
                        </div>
                        
                        {/* Spacer entre sections */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '20px', lineHeight: '20px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <p style={{ marginTop: 0, textAlign: 'center', color: '#333333', fontSize: '16px', lineHeight: '1.6', marginBottom: 0 }}>
                          En attendant, découvrez notre catalogue de produits professionnels en courant faible :
                        </p>
                        
                        {/* Spacer */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '10px', lineHeight: '10px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ textAlign: 'center' }}>
                          <a
                            href="#"
                            style={{
                              display: 'inline-block',
                              padding: '16px 32px',
                              backgroundColor: '#1d4ed8',
                              color: '#ffffff',
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              fontSize: '16px'
                            }}
                          >
                            🛒 Visiter notre boutique en ligne
                          </a>
                        </div>
                        
                        {/* Spacer entre sections */}
                        <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody><tr><td style={{ height: '20px', lineHeight: '20px' }}>&nbsp;</td></tr></tbody>
                        </table>
                        
                        <div style={{ backgroundColor: '#f3f4f6', padding: '20px' }}>
                          <p style={{ margin: '0 0 15px 0', fontSize: '15px', fontWeight: 'bold', color: '#333333' }}>
                            💬 Une question ?
                          </p>
                          <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.6' }}>
                            Notre équipe est disponible du lundi au vendredi, de 9h à 18h
                          </p>
                          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2563eb' }}>
                            📧 info.xeilom@xeilom.fr
                          </p>
                          <p style={{ margin: 0, fontSize: '14px', color: '#2563eb' }}>
                            📞 03 65 61 04 20
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Footer */}
                    <tr>
                      <td style={{ backgroundColor: '#f3f4f6', padding: '30px', textAlign: 'center', color: '#6b7280', fontSize: '12px', border: '1px solid #e5e7eb' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#333333' }}>XEILOM - Distributeur & Fabricant Courant Faible</p>
                        <p style={{ margin: '0 0 15px 0' }}>info.xeilom@xeilom.fr | 03 65 61 04 20</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                          Cet email a été envoyé automatiquement suite à votre demande de création de compte professionnel.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
