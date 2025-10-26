import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Ne pas initialiser Resend au chargement du module (évite l'erreur de build)
// Il sera initialisé dans la fonction POST seulement quand nécessaire

// Configuration pour les gros fichiers et timeout prolongé
export const maxDuration = 30 // 30 secondes

interface EmailPayload {
  companyName: string
  email: string
  phone: string
  kbisFile?: string // Base64 du fichier KBIS
  kbisFileName?: string
  pdfFile?: string // Base64 du PDF récapitulatif
  pdfFileName?: string
  signature?: string // Signature en base64
  companyInfo: {
    siren?: string
    siret?: string
    nafApe?: string
    tvaIntracom?: string
    address?: string
    postalCode?: string
    city?: string
  }
}

/**
 * API route pour envoyer les emails de confirmation
 *
 * Envoie 2 emails :
 * 1. À communication@xeilom.fr avec le récapitulatif + KBIS
 * 2. À l'utilisateur avec message de remerciement + lien boutique
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
      body.email,
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

    // Préparer les pièces jointes (KBIS + PDF récapitulatif)
    const attachments = []

    // Ajouter le KBIS
    if (body.kbisFile && body.kbisFileName) {
      attachments.push({
        filename: body.kbisFileName,
        content: Buffer.from(body.kbisFile, 'base64'),
      })
    }

    // Ajouter le PDF récapitulatif (envoyé depuis le client)
    if (body.pdfFile && body.pdfFileName) {
      attachments.push({
        filename: body.pdfFileName,
        content: Buffer.from(body.pdfFile, 'base64'),
      })
    }

    // Email 1 : À l'équipe XEILOM (récapitulatif + KBIS)
    console.log('📨 [EMAIL DEBUG] Sending email 1 to team')
    const emailToTeam = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@xeilom.fr',
      to: 'communication@xeilom.fr',
      subject: `🎯 Nouvelle demande de compte professionnel - ${body.companyName}`,
      attachments: attachments,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .info-box { background: white; padding: 20px; margin: 15px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
              .info-label { font-weight: bold; color: #1e40af; }
              .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎯 Nouvelle demande de compte professionnel</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">XEILOM</p>
              </div>
              
              <div class="content">
                <p><strong>Une nouvelle demande de création de compte professionnel a été soumise.</strong></p>
                
                <h2 style="color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Informations de l'entreprise</h2>
                
                <div class="info-box">
                  <div style="margin-bottom: 10px;"><span class="info-label">Nom :</span> ${
                    body.companyName
                  }</div>
                  ${
                    body.companyInfo.siren
                      ? `<div style="margin-bottom: 10px;"><span class="info-label">SIREN :</span> ${body.companyInfo.siren}</div>`
                      : ''
                  }
                  ${
                    body.companyInfo.siret
                      ? `<div style="margin-bottom: 10px;"><span class="info-label">SIRET :</span> ${body.companyInfo.siret}</div>`
                      : ''
                  }
                  ${
                    body.companyInfo.nafApe
                      ? `<div style="margin-bottom: 10px;"><span class="info-label">NAF/APE :</span> ${body.companyInfo.nafApe}</div>`
                      : ''
                  }
                  ${
                    body.companyInfo.tvaIntracom
                      ? `<div style="margin-bottom: 10px;"><span class="info-label">TVA Intracommunautaire :</span> ${body.companyInfo.tvaIntracom}</div>`
                      : ''
                  }
                  ${
                    body.companyInfo.address
                      ? `<div style="margin-bottom: 10px;"><span class="info-label">Adresse :</span> ${body.companyInfo.address}, ${body.companyInfo.postalCode} ${body.companyInfo.city}</div>`
                      : ''
                  }
                </div>
                
                <h2 style="color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 30px;">Contact</h2>
                
                <div class="info-box">
                  <div style="margin-bottom: 10px;"><span class="info-label">Email :</span> ${
                    body.email
                  }</div>
                  <div><span class="info-label">Téléphone :</span> ${body.phone}</div>
                </div>
                
                 <p style="margin-top: 30px; padding: 15px; background: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
                   <strong>📎 Documents en pièce jointe :</strong><br>
                   ${body.kbisFile ? `• KBIS (${body.kbisFileName})` : 'Aucun document joint'}
                 </p>
              </div>
              
              <div class="footer">
                <p>Email envoyé automatiquement depuis le formulaire de création de compte professionnel XEILOM</p>
                <p>© ${new Date().getFullYear()} XEILOM - Distributeur & Fabricant Courant Faible</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ [EMAIL DEBUG] Email 1 sent successfully:', emailToTeam.data?.id)

    // Email 2 : À l'utilisateur (message de remerciement)
    console.log('📨 [EMAIL DEBUG] Sending email 2 to user')
    const emailToUser = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@xeilom.fr',
      to: body.email,
      subject: '✅ Votre demande de compte professionnel XEILOM',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 40px; border: 1px solid #e5e7eb; }
              .highlight { background: #dbeafe; padding: 20px; border-left: 4px solid #2563eb; border-radius: 4px; margin: 20px 0; }
              .footer { background: #f3f4f6; padding: 30px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 15px 30px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
            <div class="header" style="padding-bottom: 40px;">
              <img src="https://www.xeilom.fr/Files/126457/Img/23/logo-quadri-hd-scaled-removebg-preview.png" alt="XEILOM" style="max-width: 200px; height: auto; margin: 0 auto 20px auto; display: block;">
              <h1 style="margin: 0; font-size: 28px;">✅ Demande reçue !</h1>
              <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">Merci pour votre confiance</p>
            </div>
              
              <div class="content">
                <p style="font-size: 18px; margin-bottom: 20px;">
                  Bonjour,<br><br>
                  
                  Votre demande de compte professionnel chez <strong>${body.companyName}</strong> a bien été reçue par notre équipe.
                </p>
                
                <div class="highlight">
                  <p style="margin: 0; font-size: 16px;">
                    <strong>📋 Prochaines étapes :</strong><br><br>
                    • Votre demande sera traitée sous <strong>48 heures</strong><br>
                    • Vous recevrez un email de confirmation avec vos identifiants dès l'activation de votre compte<br>
                    • Vous pourrez alors accéder à nos tarifs professionnels et passer commande
                  </p>
                </div>
                
                <p style="margin-top: 30px; text-align: center;">
                  En attendant, découvrez notre catalogue de produits professionnels en courant faible :
                </p>
                
                <div style="text-align: center;">
                  <a href="https://www.xeilom.fr" style="display: inline-block; padding: 16px 32px; background: #1d4ed8; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3); transition: all 0.3s;">
                    🛒 Visiter notre boutique en ligne
                  </a>
                </div>
                
                <p style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; font-size: 14px;">
                  <strong>💬 Une question ?</strong><br>
                  Notre équipe est disponible du lundi au vendredi, de 9h à 18h<br>
                  📧 <a href="mailto:info.xeilom@xeilom.fr" style="color: #2563eb;">info.xeilom@xeilom.fr</a><br>
                  📞 <a href="tel:0365610420" style="color: #2563eb;">03 65 61 04 20</a>
                </p>
              </div>
              
              <div class="footer">
                <p><strong>XEILOM</strong> - Distributeur & Fabricant Courant Faible</p>
                <p>info.xeilom@xeilom.fr | 03 65 61 04 20</p>
                <p style="margin-top: 20px; font-size: 11px; opacity: 0.7;">
                  Cet email a été envoyé automatiquement suite à votre demande de création de compte professionnel.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ [EMAIL DEBUG] Email 2 sent successfully:', emailToUser.data?.id)
    console.log('✅ [EMAIL DEBUG] Both emails sent successfully!')

    return NextResponse.json({
      success: true,
      message: 'Emails envoyés avec succès',
      teamEmailId: emailToTeam.data?.id,
      userEmailId: emailToUser.data?.id,
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
