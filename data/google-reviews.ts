/**
 * Avis Google de Xeilom
 *
 * Pour mettre à jour les avis :
 * 1. Modifie la note moyenne et le nombre total d'avis
 * 2. Remplace les avis dans le tableau ci-dessous
 * 3. Change le lien Google Maps vers ta page d'avis
 */

export const googleReviewsData = {
  // Note moyenne (ex: 4.9)
  averageRating: 4.9,

  // Nombre total d'avis
  totalReviews: 30,

  // Lien vers ta page Google My Business (pour le bouton "Voir tous les avis")
  // Remplace par ton lien Google Maps
  googleMapsUrl: 'https://g.page/r/VOTRE_LIEN_GOOGLE_ICI/review',

  // Liste des avis à afficher (max 3-6 recommandé)
  reviews: [
    {
      // Initiales pour l'avatar (2 lettres max)
      initials: 'JD',
      // Nom complet du client
      authorName: 'Jean Dupont',
      // Note sur 5 (1 à 5)
      rating: 5,
      // Date relative (ex: "Il y a 2 semaines", "Il y a 1 mois")
      relativeTime: 'Il y a 2 semaines',
      // Texte de l'avis (copie-colle depuis Google)
      text: '"Excellent service ! L\'équipe Xeilom a réalisé notre installation VDI avec un professionnalisme remarquable. Délais respectés et travail soigné. Je recommande vivement."',
    },
    {
      initials: 'ML',
      authorName: 'Marie Lefebvre',
      rating: 5,
      relativeTime: 'Il y a 1 mois',
      text: '"Très réactifs et à l\'écoute. Notre système de vidéosurveillance fonctionne parfaitement. Le chargé d\'affaires nous a parfaitement conseillé. Prestation de qualité."',
    },
    {
      initials: 'PB',
      authorName: 'Pierre Bernard',
      rating: 5,
      relativeTime: 'Il y a 3 semaines',
      text: '"Installation téléphonie IP impeccable. Équipe compétente et professionnelle. Rapport qualité-prix excellent. Nous continuerons à faire appel à Xeilom pour nos futurs projets."',
    },
  ],
}
