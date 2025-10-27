import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Ne pas initialiser Resend au chargement du module (évite l'erreur de build)
// Il sera initialisé dans la fonction POST seulement quand nécessaire

// Configuration pour les gros fichiers et timeout prolongé
export const maxDuration = 30 // 30 secondes

interface EmailPayload {
  companyName: string
  // Contacts
  responsableAchatEmail: string
  responsableAchatPhone: string
  serviceComptaEmail: string
  serviceComptaPhone: string
  // Documents
  kbisFile?: string // Base64 du fichier KBIS
  kbisFileName?: string
  pdfFile?: string // Base64 du PDF récapitulatif
  pdfFileName?: string
  signature?: string // Signature en base64
  // Informations entreprise
  companyInfo: {
    siren?: string
    siret?: string
    nafApe?: string
    tvaIntracom?: string
    address?: string
    postalCode?: string
    city?: string
    deliveryAddress?: string
    deliveryPostalCode?: string
    deliveryCity?: string
  }
}

/**
 * API route pour envoyer les emails de confirmation
 *
 * Envoie 2 emails :
 * 1. À communication@xeilom.fr avec le récapitulatif + KBIS
 * 2. Au client (Responsable Achat) avec Cc au Service Compta si email différent
 *
 * Optimisation : évite les doublons si Responsable Achat = Service Compta
 */
export async function POST(request: NextRequest) {
  try {
    // Initialiser Resend ici pour éviter l'erreur lors du build
    const resendApiKey = process.env.RESEND_API_KEY

    console.log('🔍 [EMAIL DEBUG] API Key exists:', !!resendApiKey)
    console.log('🔍 [EMAIL DEBUG] API Key length:', resendApiKey?.length || 0)

    if (!resendApiKey) {
      console.error('❌ RESEND_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'Configuration manquante',
          message: "La clé API Resend n'est pas configurée",
        },
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)
    const body: EmailPayload = await request.json()

    console.log(
      '📧 [EMAIL DEBUG] Sending emails to:',
      body.responsableAchatEmail,
      'and communication@xeilom.fr'
    )

    // Calculer la taille des fichiers envoyés
    const kbisSize = body.kbisFile ? Math.round((body.kbisFile.length * 0.75) / 1024) : 0
    const pdfSize = body.pdfFile ? Math.round((body.pdfFile.length * 0.75) / 1024) : 0
    console.log(
      `📦 [EMAIL DEBUG] File sizes - KBIS: ${kbisSize}KB, PDF: ${pdfSize}KB, Total: ${
        kbisSize + pdfSize
      }KB`
    )

    // Fonction de décompression
    const decompressData = (base64String: string): Buffer => {
      try {
        // Si c'est compressé avec gzip, décompresser
        const buffer = Buffer.from(base64String, 'base64')
        // Vérifier si c'est un fichier gzip (magic bytes: 1f 8b)
        if (buffer[0] === 0x1f && buffer[1] === 0x8b) {
          const zlib = require('zlib')
          return zlib.gunzipSync(buffer)
        }
        return buffer
      } catch (error) {
        console.warn('Decompression failed, using as-is:', error)
        return Buffer.from(base64String, 'base64')
      }
    }

    // Préparer les pièces jointes (KBIS + PDF récapitulatif)
    const attachments = []

    // Ajouter le KBIS
    if (body.kbisFile && body.kbisFileName) {
      attachments.push({
        filename: body.kbisFileName,
        content: decompressData(body.kbisFile),
      })
    }

    // Ajouter le PDF récapitulatif (envoyé depuis le client)
    if (body.pdfFile && body.pdfFileName) {
      attachments.push({
        filename: body.pdfFileName,
        content: decompressData(body.pdfFile),
      })
    }

    // Email 1 : À l'équipe XEILOM (KBIS + PDF récapitulatif)
    console.log('📨 [EMAIL DEBUG] Sending email 1 to team')
    const emailToTeam = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@xeilom.fr',
      to: 'communication@xeilom.fr',
      subject: `🎯 Nouvelle demande de compte professionnel - ${body.companyName}`,
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if mso]>
            <style type="text/css">
              body, table, td { font-family: Arial, sans-serif !important; }
            </style>
            <![endif]-->
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 20px;">
                  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #2563eb; padding: 30px 20px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🎯 Nouvelle demande de compte professionnel</h1>
                        <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">XEILOM</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 30px 20px; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 20px 0; font-size: 16px;"><strong>Une nouvelle demande de création de compte professionnel a été soumise.</strong></p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <td>
                              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Informations de l'entreprise</h2>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                  <td style="padding-bottom: 8px;">
                                    <span style="font-weight: bold; color: #1e40af;">Nom :</span> ${
                                      body.companyName
                                    }
                                  </td>
                                </tr>
                                ${
                                  body.companyInfo.siren
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">SIREN :</span> ${body.companyInfo.siren}</td></tr>`
                                    : ''
                                }
                                ${
                                  body.companyInfo.siret
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">SIRET :</span> ${body.companyInfo.siret}</td></tr>`
                                    : ''
                                }
                                ${
                                  body.companyInfo.nafApe
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">NAF/APE :</span> ${body.companyInfo.nafApe}</td></tr>`
                                    : ''
                                }
                                ${
                                  body.companyInfo.tvaIntracom
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">TVA Intracommunautaire :</span> ${body.companyInfo.tvaIntracom}</td></tr>`
                                    : ''
                                }
                                ${
                                  body.companyInfo.address
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">Adresse de facturation :</span> ${body.companyInfo.address}, ${body.companyInfo.postalCode} ${body.companyInfo.city}</td></tr>`
                                    : ''
                                }
                                ${
                                  body.companyInfo.deliveryAddress
                                    ? `<tr><td style="padding-bottom: 8px;"><span style="font-weight: bold; color: #1e40af;">Adresse de livraison :</span> ${body.companyInfo.deliveryAddress}, ${body.companyInfo.deliveryPostalCode} ${body.companyInfo.deliveryCity}</td></tr>`
                                    : ''
                                }
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <td>
                              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">Contacts</h2>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb;">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                  <td style="padding-bottom: 10px;">
                                    <strong style="color: #1e40af;">Responsable Achat</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom: 8px;">
                                    <span style="font-weight: bold; color: #1e40af;">Email :</span> ${
                                      body.responsableAchatEmail
                                    }
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom: 15px;">
                                    <span style="font-weight: bold; color: #1e40af;">Téléphone :</span> ${
                                      body.responsableAchatPhone
                                    }
                                  </td>
                                </tr>
                                <tr>
                                  <td style="border-top: 1px solid #e5e7eb; padding-top: 10px; padding-bottom: 10px;">
                                    <strong style="color: #1e40af;">Service Comptabilité</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom: 8px;">
                                    <span style="font-weight: bold; color: #1e40af;">Email :</span> ${
                                      body.serviceComptaEmail
                                    }
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <span style="font-weight: bold; color: #1e40af;">Téléphone :</span> ${
                                      body.serviceComptaPhone
                                    }
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                            <td style="background-color: #dbeafe; padding: 15px; border-left: 4px solid #2563eb;">
                              <p style="margin: 0; font-size: 14px;">
                                <strong>📎 Documents en pièce jointe :</strong><br>
                                ${body.kbisFile ? `• KBIS (${body.kbisFileName})` : ''}${
        body.kbisFile && body.pdfFile ? '<br>' : ''
      }
                                ${
                                  body.pdfFile
                                    ? `• PDF récapitulatif complet de la demande`
                                    : ''
                                }
                                ${
                                  !body.kbisFile && !body.pdfFile
                                    ? 'Aucun document joint'
                                    : ''
                                }
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                        <p style="margin: 0 0 8px 0;">Email envoyé automatiquement depuis le formulaire de création de compte professionnel XEILOM</p>
                        <p style="margin: 0;">© ${new Date().getFullYear()} XEILOM - Distributeur & Fabricant Courant Faible</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    console.log('✅ [EMAIL DEBUG] Email 1 sent successfully:', emailToTeam.data?.id)

    // Email 2 : Au client (Responsable Achat, avec Cc au Service Compta si différent)
    // Éviter les doublons si les emails sont identiques
    const isSameEmail =
      body.responsableAchatEmail.toLowerCase() === body.serviceComptaEmail.toLowerCase()
    const recipientEmails = isSameEmail
      ? [body.responsableAchatEmail]
      : [body.responsableAchatEmail, body.serviceComptaEmail]

    console.log('📨 [EMAIL DEBUG] Sending email to client')
    console.log('📨 [EMAIL DEBUG] Recipients:', recipientEmails)

    const emailToClient = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@xeilom.fr',
      to: body.responsableAchatEmail,
      cc: isSameEmail ? undefined : [body.serviceComptaEmail],
      subject: '✅ Votre demande de compte professionnel XEILOM',
      html: `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="x-apple-disable-message-reformatting">
            <!--[if mso]>
            <style type="text/css">
              body, table, td { font-family: Arial, sans-serif !important; }
            </style>
            <![endif]-->
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 20px;">
                  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                            <td align="center" style="padding-bottom: 20px;">
                              <img src="https://www.xeilom.fr/Files/126457/Img/23/logo-quadri-hd-scaled-removebg-preview.png" alt="XEILOM" width="200" height="auto" style="max-width: 200px; height: auto; display: block; margin: 0 auto;">
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">✅ Demande reçue !</h1>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding-top: 10px;">
                              <p style="margin: 0; color: #e0e7ff; font-size: 16px;">Merci pour votre confiance</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 40px 20px; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 20px 0; font-size: 18px; color: #333333;">
                          Bonjour,<br><br>
                          
                          Votre demande de compte professionnel chez <strong>${body.companyName}</strong> a bien été reçue par notre équipe.
                        </p>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <td style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #2563eb;">
                              <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #333333;">
                                📋 Prochaines étapes :
                              </p>
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                  <td style="padding-bottom: 8px; font-size: 16px; color: #333333;">
                                    • Votre demande sera traitée sous <strong>24 heures</strong>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom: 8px; font-size: 16px; color: #333333;">
                                    • Vous recevrez un email de confirmation dès l'activation de votre compte
                                  </td>
                                </tr>
                                <tr>
                                  <td style="font-size: 16px; color: #333333;">
                                    • Vous pourrez alors accéder à nos tarifs professionnels et passer commande
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px;">
                          <tr>
                            <td align="center" style="padding-bottom: 15px;">
                              <p style="margin: 0; color: #333333;">
                                En attendant, découvrez notre catalogue de produits professionnels en courant faible :
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center">
                              <a href="https://www.xeilom.fr" style="display: inline-block; padding: 16px 32px; background-color: #1d4ed8; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                🛒 Visiter notre boutique en ligne
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                          <tr>
                            <td style="background-color: #f3f4f6; padding: 15px;">
                              <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #333333;">
                                💬 Une question ?
                              </p>
                              <p style="margin: 0 0 8px 0; font-size: 14px; color: #333333;">
                                Notre équipe est disponible du lundi au vendredi, de 9h à 18h
                              </p>
                              <p style="margin: 0 0 5px 0; font-size: 14px; color: #2563eb;">
                                📧 <a href="mailto:info.xeilom@xeilom.fr" style="color: #2563eb;">info.xeilom@xeilom.fr</a>
                              </p>
                              <p style="margin: 0; font-size: 14px; color: #2563eb;">
                                📞 <a href="tel:0365610420" style="color: #2563eb;">03 65 61 04 20</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f3f4f6; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 8px 0; font-weight: bold; color: #333333;">XEILOM - Distributeur & Fabricant Courant Faible</p>
                        <p style="margin: 0 0 15px 0;">info.xeilom@xeilom.fr | 03 65 61 04 20</p>
                        <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                          Cet email a été envoyé automatiquement suite à votre demande de création de compte professionnel.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    console.log(
      '✅ [EMAIL DEBUG] Client email sent successfully:',
      emailToClient.data?.id
    )
    console.log('✅ [EMAIL DEBUG] All emails sent successfully!')

    return NextResponse.json({
      success: true,
      message: 'Emails envoyés avec succès',
      teamEmailId: emailToTeam.data?.id,
      clientEmailId: emailToClient.data?.id,
      recipients: {
        to: body.responsableAchatEmail,
        cc: isSameEmail ? 'aucun (email identique)' : body.serviceComptaEmail,
      },
    })
  } catch (error) {
    console.error("❌ [EMAIL ERROR] Erreur lors de l'envoi des emails:", error)
    console.error('❌ [EMAIL ERROR] Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi des emails",
        message: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}
