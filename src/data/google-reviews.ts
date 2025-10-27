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
    'https://www.google.com/search?sca_esv=bd032de3f00d742c&sxsrf=AE3TifO-85bybyqd4wcDBq_fX051-Eiz2A:1761555310986&q=xeilom&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-Ex_FWoLcTcQEocsSFNuBYVujs_ARDgt_ACKGpCI0hvZRGIXf17RL8hsYMuQUno3XdrB2K9Y%3D&uds=AOm0WdFtkCuWBhRwUN_KebTX4_PPPKMBpKuyDb15ZkDQFat3rqz4985wmMz-BiRzNFzBkj2ETec1eDCkWh2DI1e2GzgXDBq9lU2ZGFol7RYR6TxIHFdUB1A&sa=X&sqi=2&ved=2ahUKEwi89MD0gMSQAxWWcaQEHTySC_oQ3PALegQIMxAF&biw=1728&bih=913&dpr=2',

  // Liste des avis à afficher (max 3-6 recommandé)
  reviews: [
    {
      initials: 'JD',
      authorName: 'Jean Dupont',
      rating: 5,
      relativeTime: 'Il y a 2 semaines',
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
    {
      initials: 'SC',
      authorName: 'Sophie Chen',
      rating: 5,
      relativeTime: 'Il y a 1 semaine',
      text: '"Service client exceptionnel et livraison rapide. Les produits de Xeilom sont de qualité supérieure. Je recommande sans hésitation pour vos projets de courant faible."',
    },
    {
      initials: 'TL',
      authorName: 'Thomas Leblanc',
      rating: 5,
      relativeTime: 'Il y a 5 jours',
      text: '"Excellent rapport qualité-prix et conseils avisés. L\'équipe a su répondre à toutes nos questions et nous proposer des solutions adaptées à notre budget. Très satisfait !"',
    },
  ],
}
