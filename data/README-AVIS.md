# 📝 Guide de mise à jour des avis Google

## 🎯 Fichier à modifier : `data/google-reviews.ts`

### 🔄 **Comment mettre à jour tes avis chaque mois** :

#### **1. Note moyenne et nombre d'avis**

```typescript
averageRating: 4.9,  // ← Change la note
totalReviews: 47,    // ← Change le nombre total
```

#### **2. Lien Google Maps** ⭐ **NOUVEAU : Bouton de redirection !**

```typescript
googleMapsUrl: 'https://g.page/r/TON_LIEN/review',
```

**🔍 Pour trouver ton lien :**

1. Va sur Google Maps
2. Cherche "Xeilom"
3. Clique sur "Avis"
4. Copie l'URL de la page

**✨ Le bouton "Voir tous nos avis Google" apparaîtra automatiquement sous le carrousel une fois le lien configuré !**

---

#### **3. Ajouter/Modifier des avis**

```typescript
{
  initials: 'JD',              // ← 2 lettres max (Prénom + Nom)
  authorName: 'Jean Dupont',   // ← Nom complet
  rating: 5,                   // ← Note sur 5 (1 à 5)
  relativeTime: 'Il y a 2 semaines',  // ← Date relative
  text: '"Texte de l\'avis..."',  // ← Copie-colle depuis Google
},
```

---

### 📋 **Exemple : Ajouter un nouvel avis**

```typescript
reviews: [
  // Avis existants...
  {
    initials: 'SC',
    authorName: 'Sophie Chevalier',
    rating: 5,
    relativeTime: 'Il y a 1 jour',
    text: '"Super prestation ! Je recommande à 100%."',
  },
]
```

---

### ⚠️ **Points importants** :

1. **Guillemets** : Mets des guillemets autour du texte : `"Texte..."`
2. **Apostrophes** : Échappe les apostrophes avec `\'` → `L'équipe` devient `L\'équipe`
3. **Virgules** : N'oublie pas les virgules entre chaque avis
4. **Maximum recommandé** : 3-6 avis (pour un affichage optimal)

---

### 🎨 **Personnalisation avancée**

#### **Le carrousel d'avis** 🎠

- Les avis défilent automatiquement avec les boutons de navigation (← →)
- Les indicateurs de points permettent d'aller directement à un avis
- Ajoute autant d'avis que tu veux (recommandé : 3-6)

#### Changer la couleur des avatars :

Fichier : `components/landing-page.tsx`

```typescript
style={{backgroundColor: '#363BC7'}}  // ← Ta couleur
```

#### Afficher plus/moins d'avis :

Ajoute ou supprime simplement des objets dans le tableau `reviews`

#### Le bouton "Voir tous nos avis Google" :

- Apparaît automatiquement sous le carrousel si le lien est configuré
- Affiche le nombre total d'avis (`totalReviews`)
- Ouvre Google Maps dans un nouvel onglet

---

### ✅ **Après modification** :

1. Sauvegarde le fichier
2. Recharge la page
3. Tes nouveaux avis apparaissent automatiquement ! 🎉

---

**💡 Astuce** : Met à jour tes avis tous les mois pour garder la section fraîche et crédible !
