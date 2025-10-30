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
  googleMapsUrl:
    'https://www.google.com/search?sa=X&sca_esv=ffe7acc5946abd35&hl=fr-FR&tbm=lcl&q=Xeilom+Avis#lkt=LocalPoiReviews',

  // Liste des avis à afficher (max 3-6 recommandé)
  reviews: [
    {
      initials: 'DS',
      authorName: 'Dominique STORTI',
      rating: 5,
      relativeTime: '22.05.2025',
      text:
        '« Nous consultons Xeilom depuis de nombreuses années. La confiance mutuelle s’est construite par des informations échangées en toute transparence afin de répondre le mieux possible aux demandes de nos clients... »',
    },
    {
      initials: 'CP',
      authorName: 'Caroline Pinguenet',
      rating: 5,
      relativeTime: '22.05.2025',
      text:
        '« Top fournisseur, bon prix, qualité et service »',
    },
    {
      initials: 'LB',
      authorName: 'Loris Bairrada',
      rating: 5,
      relativeTime: '07.05.2025',
      text:
        '« Bonne qualité du matériel, service commercial patient et aimable pour tout expliquer en détail, très gentils, réactifs et livraison rapide. »',
    },
    {
      initials: 'AP',
      authorName: 'Adriano Pereira',
      rating: 5,
      relativeTime: '13.10.2023',
      text:
        '« Je suis extrêmement satisfait des services fournis par cette entreprise de fourniture réseau. Leur équipe est compétente, professionnelle et toujours prête à aider... »',
    },
    {
      initials: 'CC',
      authorName: 'Claudie CHEVALIER',
      rating: 5,
      relativeTime: '15.05.2025',
      text:
        '« Service commercial très réactif, commande très rapide, reçue dans les 24h. Je recommande ! »',
    },
  ],
}
