# Création de Compte Professionnel

Application Next.js moderne pour la création de comptes professionnels avec formulaire avancé, signature électronique et upload de documents.

## 🚀 Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Composants UI**: shadcn/ui
- **Validation**: React Hook Form + Zod
- **Signature**: react-signature-canvas
- **Upload**: react-dropzone
- **API**: API INSEE Sirene (recherche entreprises)
- **Tests**: Jest + React Testing Library

## 📋 Prérequis

- Node.js 18+
- npm ou yarn

## 🛠️ Installation

1. Clonez le projet (ou naviguez dans le dossier)

```bash
cd creation-compte-pro
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez l'API INSEE (obligatoire pour l'autocomplete)

Créez un fichier `.env.local` à la racine :

```bash
INSEE_API_KEY=votre_cle_api_insee
```

> 📖 **Obtenir une clé API gratuite** : https://api.insee.fr/ (inscription gratuite)

## 🎯 Lancement

### Développement

```bash
npm run dev
```

Si vous avez des problèmes de styles qui disparaissent au rechargement :

```bash
npm run dev:clean  # Nettoie le cache et démarre
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Production

```bash
npm run build
npm start
```

### Tests

```bash
# Lancer tous les tests
npm test

# Mode watch
npm run test:watch
```

### Linter

```bash
npm run lint
```

## 📁 Structure du Projet

```
creation-compte-pro/
├── app/                    # Pages Next.js (App Router)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants UI de base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   ├── account-form.tsx  # Formulaire principal
│   ├── file-upload.tsx   # Composant d'upload
│   └── signature-pad.tsx # Composant de signature
├── lib/                  # Utilitaires et logique
│   ├── utils.ts         # Helpers
│   └── validation.ts    # Schémas Zod
├── __tests__/           # Tests unitaires
│   ├── lib/
│   └── components/
└── public/              # Assets statiques
```

## ✨ Fonctionnalités

### 🎯 Formulaire Multi-Étapes Moderne

**4 étapes intuitives avec barre de progression visuelle**

#### Étape 1 : Recherche d'entreprise

- **Autocomplete intelligent** via API INSEE Sirene
- Recherche par nom + code postal optionnel
- **Debounce 300ms** pour une recherche fluide
- **Auto-remplissage instantané** de toutes les données légales
- Compteur de résultats en temps réel
- Fallback manuel si entreprise non trouvée

#### Étape 2 : Informations entreprise

- Raison sociale, SIREN, SIRET
- Code NAF/APE
- N° TVA Intracommunautaire
- Validation automatique des formats

#### Étape 3 : Contact & Adresse

- Email professionnel
- Téléphone
- Adresse de facturation complète

#### Étape 4 : Documents & Signature

- Upload de documents légaux (drag & drop)
- Signature électronique sur canvas
- Validation finale avant soumission

### 🔍 Recherche API INSEE

- **SIREN, SIRET** : Automatiquement remplis
- **NAF/APE** : Code d'activité principal
- **TVA Intracommunautaire** : Calculée automatiquement
- **Adresse** : Voie, code postal, ville
- **Gestion d'erreurs** : 401, 429, timeout

### Validation

Validation robuste avec Zod :

- SIRET: 14 chiffres
- Email: format valide
- Téléphone: format français
- Code postal: 5 chiffres
- Fichier: max 5MB, formats PDF/PNG/JPG
- Signature: obligatoire

### Accessibilité

- Labels ARIA sur tous les champs
- Messages d'erreur descriptifs
- Navigation au clavier
- Rôles et attributs sémantiques

### Tests

Couverture des tests :

- Utilitaires (cn)
- Validation (schémas Zod)
- Composants UI (Button, Input)
- Composants métier (FileUpload)

## 🎨 Design

**Design sobre et moderne** respectant les préférences utilisateur :

- **Palette de couleurs** : Bleu/Indigo professionnels sur fond clair
- **Gradients subtils** : Du gris au bleu pour une profondeur moderne
- **Stepper visuel** : Progression claire avec icônes et états
- **Responsive** : Adaptation mobile, tablette, desktop
- **Feedback visuel** : États hover, focus, disabled, loading
- **Icônes** : Lucide React pour une UI claire et moderne
- **Animations** : Transitions fluides (300ms) sans être distrayantes

## 📝 Bonnes Pratiques

### Code

- TypeScript strict mode
- Composants fonctionnels avec hooks
- Separation of concerns (UI / logique / validation)
- Fonctions pures et réutilisables
- Nommage explicite et cohérent

### Architecture

- Structure claire par responsabilité
- Composants modulaires et réutilisables
- Configuration centralisée
- Pas de dépendances circulaires

### Qualité

- Tests unitaires sur les fonctionnalités clés
- Validation des entrées utilisateur
- Gestion des erreurs
- Documentation des fonctions publiques

## 🔧 Configuration

### Tailwind

Configuration dans `tailwind.config.ts` avec système de design tokens (couleurs, espacements, etc.)

### TypeScript

Configuration stricte dans `tsconfig.json` avec paths aliases (`@/*`)

### Jest

Configuration dans `jest.config.js` avec support JSX/TSX et path mapping

## 📦 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm start` - Serveur de production
- `npm test` - Lancer les tests
- `npm run test:watch` - Tests en mode watch
- `npm run lint` - Vérifier le code avec ESLint

## 🚧 Développement Futur

Améliorations possibles :

- Sauvegarde automatique en brouillon
- Multi-étapes avec progression
- Internationalisation (i18n)
- Mode sombre (si souhaité)
- Backend API pour la soumission
- Validation côté serveur
- Envoi d'email de confirmation

## 📄 Licence

Projet privé

## 👤 Auteur

Développé avec ❤️ pour la création de comptes professionnels
