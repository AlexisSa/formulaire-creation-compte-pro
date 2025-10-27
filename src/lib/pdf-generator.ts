/**
 * Génère un PDF de demande de compte professionnel
 * Fonctionne uniquement côté client
 */
export async function generateAccountPDF(data: any) {
  // Vérification côté client uniquement
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PDF generation not available on server side')
    }
    return new Blob(['PDF not available on server'], { type: 'application/pdf' })
  }

  try {
    // Import dynamique de jsPDF côté client uniquement
    const { default: jsPDF } = await import('jspdf')

    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = 20

    // Couleurs cohérentes avec l'app
    const primaryColor = '#2563eb' // blue-600
    const textPrimary = '#111827' // gray-900
    const textSecondary = '#4b5563' // gray-600
    const borderColor = '#e5e7eb' // gray-200
    const bgBlue = '#eff6ff' // blue-50

    // === LOGO ET EN-TÊTE ===
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, 35, 'F')

    try {
      // Charger et afficher le logo
      const logoImg = new Image()
      logoImg.src = '/xeilom-logo.png'

      // Attendre que l'image soit chargée
      await new Promise((resolve) => {
        logoImg.onload = resolve
        // Timeout de sécurité
        setTimeout(resolve, 1000)
      })

      // Calculer les dimensions pour garder les bonnes proportions
      const maxWidth = 55 // mm - réduit
      const maxHeight = 18 // mm - réduit
      const logoRatio = logoImg.width / logoImg.height

      let logoWidth = maxWidth
      let logoHeight = maxWidth / logoRatio

      if (logoHeight > maxHeight) {
        logoHeight = maxHeight
        logoWidth = maxHeight * logoRatio
      }

      doc.addImage(logoImg, 'PNG', margin, 8, logoWidth, logoHeight)
    } catch (error) {
      // Fallback sur le texte si le logo ne charge pas
      doc.setTextColor(primaryColor)
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('XEILOM', margin, 20)
    }

    yPosition = 42

    // === INFORMATIONS ENTREPRISE ===
    // Titre de section
    doc.setTextColor(primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text("Informations de l'entreprise", margin, yPosition)

    yPosition += 6

    // Ligne décorative
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 7

    // Données de l'entreprise
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textPrimary)

    const companyData = [
      { label: "Nom de l'entreprise", value: data.companyName || 'Non renseigné' },
      { label: 'SIREN', value: data.siren || 'Non renseigné' },
      { label: 'SIRET', value: data.siret || 'Non renseigné' },
      { label: 'Code NAF/APE', value: data.nafApe || 'Non renseigné' },
      { label: 'TVA Intracommunautaire', value: data.tvaIntracom || 'Non renseigné' },
    ]

    companyData.forEach(({ label, value }) => {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(textPrimary)
      doc.text(`${label}:`, margin + 5, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(textSecondary)
      doc.text(value, margin + 50, yPosition)
      yPosition += 7
    })

    // Adresse de facturation en bloc
    yPosition += 4
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Adresse de facturation:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    const address =
      `${data.address || ''}, ${data.postalCode || ''} ${data.city || ''}`
        .replace(/^, /, '')
        .trim() || 'Non renseigné'
    doc.text(address, margin + 50, yPosition)

    yPosition += 7

    // Adresse de livraison en bloc
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Adresse de livraison:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    const deliveryAddress =
      `${data.deliveryAddress || ''}, ${data.deliveryPostalCode || ''} ${
        data.deliveryCity || ''
      }`
        .replace(/^, /, '')
        .trim() || 'Non renseigné'
    doc.text(deliveryAddress, margin + 50, yPosition)

    yPosition += 14

    // === INFORMATIONS CONTACT ===
    // Titre de section
    doc.setTextColor(primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Informations de contact', margin, yPosition)

    yPosition += 5

    // Ligne décorative
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 8

    // Données de contact
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    // Responsable Achat
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('Responsable Achat:', margin + 5, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Email:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    doc.text(data.responsableAchatEmail || 'Non renseigné', margin + 50, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Téléphone:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    doc.text(data.responsableAchatPhone || 'Non renseigné', margin + 50, yPosition)
    yPosition += 8

    // Service Comptabilité
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor)
    doc.text('Service Comptabilité:', margin + 5, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Email:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    doc.text(data.serviceComptaEmail || 'Non renseigné', margin + 50, yPosition)
    yPosition += 6

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Téléphone:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    doc.text(data.serviceComptaPhone || 'Non renseigné', margin + 50, yPosition)
    yPosition += 12

    // === CONDITIONS DE RÈGLEMENT ===
    // Titre de section
    doc.setTextColor(primaryColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Conditions de règlement', margin, yPosition)

    yPosition += 5

    // Ligne décorative
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)

    yPosition += 8

    // Données des conditions de règlement
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')

    // 1ère commande
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('1ère commande:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    doc.text('Règlement avant expédition de marchandise', margin + 40, yPosition)
    yPosition += 6

    // Autres commandes
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(textPrimary)
    doc.text('Autres commandes:', margin + 5, yPosition)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(textSecondary)
    const otherOrdersText =
      "Après ouverture du compte client professionnel, et après acceptation de notre service financier, le règlement des matériels pourra s'effectuer à 30 jours fin de mois"

    // Découper le texte sur plusieurs lignes si nécessaire
    const textLines = doc.splitTextToSize(otherOrdersText, pageWidth - margin - 50)
    doc.text(textLines, margin + 40, yPosition)
    yPosition += textLines.length * 6 + 8

    // === SIGNATURE ===
    if (data.signature) {
      // Titre de section
      doc.setTextColor(primaryColor)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Signature électronique', margin, yPosition)

      yPosition += 5

      // Ligne décorative
      doc.setDrawColor(primaryColor)
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)

      yPosition += 8

      try {
        // Convertir la signature en image et l'ajouter au PDF
        const signatureImg = new Image()
        signatureImg.src = data.signature

        // Attendre que l'image soit chargée
        await new Promise((resolve) => {
          signatureImg.onload = resolve
        })

        const imgWidth = 70
        const imgHeight = 25
        doc.addImage(signatureImg, 'PNG', margin + 5, yPosition, imgWidth, imgHeight)
        yPosition += imgHeight + 7
      } catch (error) {
        doc.setFontSize(9)
        doc.setTextColor(textSecondary)
        doc.text('Signature non disponible', margin + 5, yPosition)
        yPosition += 10
      }
    }

    // === PIED DE PAGE ===
    yPosition = pageHeight - 30

    // Ligne de séparation
    doc.setDrawColor(borderColor)
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 6

    // Informations de contact
    doc.setTextColor(textSecondary)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('XEILOM - Distributeur & Fabricant Courant Faible', margin, yPosition)
    doc.text('info.xeilom@xeilom.fr | www.xeilom.fr', margin, yPosition + 4)
    doc.text(
      `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
      pageWidth - margin - 40,
      yPosition
    )

    // === RETOUR DU BLOB ===
    const pdfBlob = doc.output('blob')

    if (process.env.NODE_ENV === 'development') {
      console.log(`📄 PDF généré: ${(pdfBlob.size / 1024).toFixed(2)} KB`)
    }

    return pdfBlob
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors de la génération du PDF:', error)
    }
    return new Blob(['Erreur lors de la génération du PDF'], { type: 'application/pdf' })
  }
}

export default generateAccountPDF
