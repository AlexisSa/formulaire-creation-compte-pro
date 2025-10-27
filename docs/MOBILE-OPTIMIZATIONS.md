# Optimisations Mobiles

Ce document décrit les optimisations mobiles implémentées pour améliorer l'expérience utilisateur sur appareils mobiles.

## 📱 Fonctionnalités Implémentées

### 1. **Compression Automatique d'Images**

Les images uploadées sont automatiquement compressées pour optimiser :

- **Taille de fichier** : Réduction jusqu'à 500KB
- **Qualité visuelle** : Préservée à 80%
- **Performance** : Upload plus rapide sur connexions lentes

**Fichiers modifiés** :

- `src/lib/image-compression.ts` - Utilitaires de compression
- `src/components/file-upload.tsx` - Intégration de la compression

**Fonctionnalités** :

- Compression automatique des images PNG/JPG
- Redimensionnement intelligent (max 2048px)
- Indicateur visuel de compression en cours
- Fallback sur fichier original en cas d'erreur

### 2. **Reflow Amélioré sur Petits Écrans**

Optimisations CSS pour l'affichage mobile :

**Fichiers modifiés** :

- `app/globals.css` - Nouveaux styles responsive

**Améliorations** :

- **Classes utilitaires** :
  - `.mobile-stack` - Colonnes empilées sur mobile
  - `.mobile-center` - Texte centré sur mobile
  - `.mobile-full-width` - Largeur 100% sur mobile
  - `.mobile-padding` - Padding réduit sur mobile
- **Breakpoints** :

  - `640px` - Petits écrans / smartphones
  - `375px` - Très petits écrans
  - `896px` - Mode paysage mobile

- **Touch targets** :
  - Min 44x44px pour tous les éléments interactifs
  - Optimisation pour `pointer: coarse` (écrans tactiles)

### 3. **Table Horizontale Scrollable**

Composant pour tables larges sur mobile en mode paysage.

**Fichiers créés** :

- `src/components/ui/scrollable-table.tsx`

**Fonctionnalités** :

- Défilement horizontal fluide
- Boutons de navigation automatiques
- Détection de la scrollabilité
- Scroll optimisé avec `-webkit-overflow-scrolling: touch`

**Utilisation** :

```tsx
import { ScrollableTable } from '@/components/ui/scrollable-table'

;<ScrollableTable>
  <table>{/* Contenu de la table */}</table>
</ScrollableTable>
```

## 🎨 Composants Améliorés

### FileUpload

- **Mobile** : Padding réduit, icônes ajustées
- **Texte** : "ou glissez-déposez" masqué sur mobile
- **Compression** : Indicateur de chargement visible

### Stepper

- **Espacement** : Gap réduit sur mobile (2px → 4px)
- **Labels** : Description masquée sur petits écrans

### Notifications

- **Position** : Pleine largeur sur mobile, fixe à droite sur desktop
- **Largeur max** : 320px sur mobile

## 🎯 Performance Mobile

### Optimisations GPU

```css
.mobile-optimized {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
```

### Scroll Optimisé

```css
.scroll-horizontal {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### Réduction de la Latence Tactile

```css
-webkit-tap-highlight-color: transparent;
```

## 📊 Mode Paysage

Optimisations spécifiques pour le mode paysage sur mobile :

```css
@media (orientation: landscape) and (max-width: 896px) {
  .landscape-hide {
    display: none !important;
  }
  .landscape-compact {
    padding: 1rem;
  }
}
```

## 🧪 Tests Recommandés

1. **Compression d'images** :

   - Uploader une image de 5MB
   - Vérifier que la taille finale < 500KB
   - Valider que la qualité visuelle est acceptable

2. **Responsive** :

   - Tester sur iPhone SE (375px)
   - Tester sur iPad (768px)
   - Tester en mode paysage

3. **Touch targets** :
   - Vérifier que tous les boutons font au moins 44x44px
   - Valider la navigation au doigt

## 📝 Notes d'Implémentation

### Compression d'Images

La compression utilise le Canvas API :

1. Charge l'image dans un `<canvas>`
2. Redimensionne si nécessaire
3. Convertit en Blob avec qualité 0.8
4. Crée un nouveau File optimisé

**Limitations** :

- Uniquement les images (PNG/JPG)
- Les PDF ne sont pas compressés
- La compression côté client utilise le CPU

### Réflex Mobile

Les améliorations de reflow incluent :

- Flexbox adaptatif
- Textes responsives
- Padding/spacing adaptatifs
- Hide/show conditionnel selon la taille d'écran

## 🚀 Améliorations Futures Possibles

1. **Lazy loading** : Images chargées à la demande
2. **Progressive images** : Placeholder → Image floue → Image nette
3. **Service Worker** : Cache des assets statiques
4. **WebP support** : Format d'image plus léger
5. **Préchargement** : Anticipation du défilement

## 📚 Références

- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [CSS Tricks - Touch Targets](https://css-tricks.com/touch-target-size/)
- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)
