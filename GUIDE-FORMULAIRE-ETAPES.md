# Guide détaillé : Étapes du formulaire de création de compte professionnel

Ce guide explique en détail chaque étape du formulaire de création de compte professionnel XEILOM, avec les champs requis, la validation, et les interactions utilisateur.

## 📋 Table des matières

1. [Vue d'ensemble du formulaire](#vue-densemble-du-formulaire)
2. [Étape 1 : Identification de l'entreprise](#étape-1--identification-de-lentreprise)
3. [Étape 2 : Coordonnées professionnelles](#étape-2--coordonnées-professionnelles)
4. [Étape 3 : Validation et documents](#étape-3--validation-et-documents)
5. [Navigation et validation](#navigation-et-validation)
6. [Génération du PDF](#génération-du-pdf)
7. [Gestion des erreurs](#gestion-des-erreurs)

## 🎯 Vue d'ensemble du formulaire

Le formulaire de création de compte professionnel est divisé en **3 étapes principales** :

```typescript
const STEPS = [
  { id: 1, title: 'Votre Entreprise', description: 'Identification' },
  { id: 2, title: 'Contact', description: 'Coordonnées' },
  { id: 3, title: 'Validation', description: 'Documents' },
]
```

### Fonctionnalités principales

- **Navigation par étapes** avec stepper visuel
- **Validation en temps réel** avec React Hook Form + Zod
- **Recherche automatique d'entreprise** via API INSEE
- **Upload de documents** avec drag & drop
- **Signature électronique** avec canvas
- **Génération de PDF** automatique
- **Animations fluides** avec Framer Motion

---

## 🏢 Étape 1 : Identification de l'entreprise

### Objectif

Identifier et valider l'entreprise du client via l'API INSEE ou saisie manuelle.

### Interface utilisateur

```typescript
// Titre et description
<h2>Identification de votre entreprise</h2>
<p>Pour traiter votre demande de compte client, nous avons besoin de vérifier
l'identité de votre entreprise. Utilisez notre moteur de recherche pour un
remplissage automatique des informations légales.</p>
```

### Champs de recherche

#### 1. **Recherche automatique INSEE**

- **Composant** : `EntrepriseAutocomplete`
- **Champs** :
  - **Nom de l'entreprise** (obligatoire, min 2 caractères)
  - **Code postal** (optionnel, 5 chiffres)
- **Fonctionnalités** :
  - Debounce de 300ms
  - Recherche en temps réel
  - Navigation clavier (flèches, Entrée, Échap)
  - Affichage des résultats avec détails

#### 2. **Informations légales** (remplies automatiquement ou manuellement)

##### Raison sociale

- **Type** : `text`
- **Validation** : 2-100 caractères
- **Icône** : `Building2`
- **Placeholder** : "SARL EXEMPLE"
- **Remplissage auto** : Via recherche INSEE

##### SIREN

- **Type** : `text`
- **Validation** : 9 chiffres exactement
- **Icône** : `Hash`
- **Placeholder** : "123456789"
- **MaxLength** : 9
- **Remplissage auto** : Via recherche INSEE

##### SIRET

- **Type** : `text`
- **Validation** : 14 chiffres exactement
- **Icône** : `Hash`
- **Placeholder** : "12345678900001"
- **MaxLength** : 14
- **Remplissage auto** : Via recherche INSEE

##### Code NAF/APE

- **Type** : `text`
- **Validation** : Optionnel
- **Icône** : `FileText`
- **Placeholder** : "6201Z"
- **Remplissage auto** : Via recherche INSEE

##### N° TVA Intracommunautaire

- **Type** : `text`
- **Validation** : Format FR + 11 chiffres
- **Icône** : `Globe`
- **Placeholder** : "FR12345678901"
- **MaxLength** : 13
- **Remplissage auto** : Calculé automatiquement

### Validation des champs

```typescript
// Schéma de validation Zod
companyName: z
  .string()
  .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
  .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),

siren: z
  .string()
  .regex(/^\d{9}$/, 'Le SIREN doit contenir exactement 9 chiffres')
  .optional()
  .or(z.literal('')),

siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),

nafApe: z.string().optional().or(z.literal('')),

tvaIntracom: z
  .string()
  .regex(/^FR\d{11}$/, 'Le numéro de TVA doit avoir le format FR suivi de 11 chiffres')
  .optional()
  .or(z.literal('')),
```

### Comportement de la recherche INSEE

1. **Déclenchement** : Tapez au moins 2 caractères
2. **Debounce** : Attente de 300ms après arrêt de frappe
3. **Requête API** : Appel à `/api/insee/search`
4. **Affichage** : Liste déroulante avec résultats
5. **Sélection** : Remplissage automatique de tous les champs
6. **Confirmation** : Message de succès avec bouton "Changer"

---

## 📞 Étape 2 : Coordonnées professionnelles

### Objectif

Collecter les informations de contact et l'adresse de facturation.

### Interface utilisateur

```typescript
// Titre et description
<h2>Vos coordonnées professionnelles</h2>
<p>Ces informations nous permettront de vous contacter pour la gestion de votre
compte et l'envoi de vos devis, factures et documents commerciaux.</p>
```

### Section Contact

#### Email professionnel

- **Type** : `email`
- **Validation** : Format email valide + obligatoire
- **Icône** : `Mail`
- **Placeholder** : "contact@entreprise.fr"
- **Remplissage auto** : Depuis l'étape 1 (si disponible)

#### Téléphone

- **Type** : `tel`
- **Validation** : Format téléphone français
- **Icône** : `Phone`
- **Placeholder** : "01 23 45 67 89"
- **Regex** : `/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/`

### Section Adresse de facturation

#### Adresse

- **Type** : `text`
- **Validation** : Minimum 5 caractères
- **Icône** : `Home`
- **Placeholder** : "123 Rue de la République"
- **Remplissage auto** : Depuis l'étape 1 (si disponible)

#### Code postal

- **Type** : `text`
- **Validation** : 5 chiffres exactement
- **Placeholder** : "75001"
- **MaxLength** : 5
- **Regex** : `/^\d{5}$/`
- **Remplissage auto** : Depuis l'étape 1 (si disponible)

#### Ville

- **Type** : `text`
- **Validation** : Minimum 2 caractères
- **Placeholder** : "Paris"
- **Remplissage auto** : Depuis l'étape 1 (si disponible)

### Validation des champs

```typescript
// Schéma de validation Zod
email: z
  .string()
  .email("L'adresse email n'est pas valide")
  .min(1, "L'email est obligatoire"),

phone: z
  .string()
  .regex(
    /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    "Le numéro de téléphone n'est pas valide"
  ),

address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),

postalCode: z.string().regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),

city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
```

---

## 📄 Étape 3 : Validation et documents

### Objectif

Finaliser la demande avec les documents légaux et la signature électronique.

### Interface utilisateur

```typescript
// Titre et description
<h2>Validation de votre demande</h2>
<p>Pour finaliser l'ouverture de votre compte client Xeilom, nous avons besoin
d'un justificatif d'entreprise et de votre signature électronique pour
valider les conditions générales de vente.</p>
```

### Section Documents

#### Justificatif d'entreprise

- **Composant** : `FileUpload`
- **Types acceptés** : PDF, PNG, JPG
- **Taille max** : 10 MB
- **Validation** : Obligatoire
- **Icône** : `FileText`
- **Instructions** : "Kbis de moins de 3 mois, statuts, ou inscription au registre des métiers"

##### Fonctionnalités du FileUpload

- **Drag & Drop** : Glisser-déposer de fichiers
- **Sélection manuelle** : Clic pour parcourir
- **Prévisualisation** : Affichage du nom et taille du fichier
- **Suppression** : Bouton pour retirer le fichier
- **Validation** : Vérification du type et de la taille

### Section Signature

#### Signature électronique

- **Composant** : `SignaturePad`
- **Validation** : Obligatoire (min 10 caractères)
- **Icône** : `PenTool`
- **Instructions** : "En signant, vous acceptez les conditions générales de vente Xeilom"

##### Fonctionnalités du SignaturePad

- **Canvas** : Zone de dessin pour la signature
- **Effacement** : Bouton "Effacer" pour recommencer
- **Validation** : Vérification que la signature n'est pas vide
- **Format** : Image base64 pour stockage

### Section Conditions Générales de Vente

```typescript
// Informations légales
<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
  <p className="text-xs text-blue-900">
    <strong>📋 Conditions Générales de Vente</strong>
  </p>
  <p className="text-xs text-blue-800">
    Votre signature électronique a la même valeur juridique qu'une signature manuscrite
    (règlement eIDAS). En signant, vous reconnaissez avoir pris connaissance et accepter
    nos CGV disponibles ici.
  </p>
</div>
```

### Validation des champs

```typescript
// Schéma de validation Zod
legalDocument: z
  .instanceof(File, { message: 'Un document légal est requis' })
  .refine(
    (file) => file.size <= 10 * 1024 * 1024,
    'Le fichier ne doit pas dépasser 10MB'
  )
  .refine(
    (file) => ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type),
    'Format de fichier non supporté (PDF, PNG, JPG uniquement)'
  ),

signature: z
  .string()
  .min(10, 'La signature est obligatoire')
  .startsWith('data:image', 'La signature doit être une image valide'),
```

---

## 🧭 Navigation et validation

### Stepper visuel

Le formulaire utilise un composant `Stepper` qui affiche :

- **Progression** : Indicateur visuel de l'étape actuelle
- **Navigation** : Clic sur les étapes précédentes (si autorisé)
- **États** : Complété, actuel, à venir
- **Animations** : Transitions fluides entre les étapes

### Boutons de navigation

#### Bouton "Précédent"

- **Visibilité** : Affiché uniquement si `currentStep > 1`
- **Fonction** : Retour à l'étape précédente
- **Animation** : Hover et tap effects
- **Icône** : `ChevronLeft`

#### Bouton "Suivant"

- **Visibilité** : Affiché si `currentStep < STEPS.length`
- **Fonction** : Validation de l'étape + passage à la suivante
- **Validation** : Déclenche `validateStep(currentStep)`
- **Icône** : `ChevronRight`

#### Bouton "Faire ma demande"

- **Visibilité** : Affiché sur la dernière étape
- **Fonction** : Soumission du formulaire complet
- **État** : Loading pendant la soumission
- **Icône** : `Check` ou spinner de chargement

### Validation par étape

```typescript
// Fonction de validation par étape
const validateStep = async (step: number): Promise<boolean> => {
  const fieldsToValidate: (keyof AccountFormData)[][] = [
    // Étape 1 : Informations entreprise
    [
      'companyName',
      'siren',
      'siret',
      'nafApe',
      'tvaIntracom',
      'address',
      'postalCode',
      'city',
    ],
    // Étape 2 : Contact
    ['email', 'phone'],
    // Étape 3 : Documents
    ['legalDocument', 'signature'],
  ]

  const fields = fieldsToValidate[step - 1] || []
  const result = await trigger(fields as any)
  return result
}
```

### Transitions entre étapes

```typescript
// Animation de transition
const handleNext = async () => {
  const isValid = await validateStep(currentStep)
  if (isValid && currentStep < STEPS.length) {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(currentStep + 1)
      scrollToStepper()
      setTimeout(() => setIsTransitioning(false), 400)
    }, 200)
  }
}
```

---

## 📄 Génération du PDF

### Déclenchement

Le PDF est généré automatiquement lors de la soumission du formulaire :

```typescript
const onSubmit = async (data: AccountFormData) => {
  try {
    console.log('Données du formulaire:', data)

    // Générer le PDF avec toutes les informations
    await generateAccountPDF(data)

    alert('Formulaire soumis avec succès ! Le PDF a été téléchargé.')
    setCurrentStep(1)
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    alert('Une erreur est survenue lors de la génération du PDF.')
  }
}
```

### Contenu du PDF

Le PDF généré contient :

1. **En-tête** : Logo XEILOM + titre + date
2. **Informations entreprise** : Raison sociale, SIREN, SIRET, NAF/APE, TVA
3. **Adresse de facturation** : Adresse complète
4. **Contact** : Email et téléphone
5. **Signature électronique** : Image de la signature
6. **Footer** : Informations de contact XEILOM

### Nom du fichier

```typescript
const fileName = `demande-compte-client-${
  data.companyName?.replace(/[^a-zA-Z0-9]/g, '-') || 'xeilom'
}-${new Date().toISOString().split('T')[0]}.pdf`
```

---

## ⚠️ Gestion des erreurs

### Types d'erreurs

#### 1. Erreurs de validation

- **Champs obligatoires** : Message d'erreur sous le champ
- **Format invalide** : Validation en temps réel
- **Taille de fichier** : Limite de 10MB
- **Type de fichier** : PDF, PNG, JPG uniquement

#### 2. Erreurs de recherche INSEE

- **Nom trop court** : "Le nom doit contenir au moins 2 caractères"
- **Code postal invalide** : "Le code postal doit contenir 5 chiffres"
- **Aucun résultat** : "Aucune entreprise trouvée"
- **Erreur API** : Messages d'erreur spécifiques

#### 3. Erreurs de soumission

- **Génération PDF** : "Une erreur est survenue lors de la génération du PDF"
- **Validation finale** : Blocage si champs manquants

### Affichage des erreurs

```typescript
// Exemple d'affichage d'erreur
{
  errors.companyName && (
    <p id="companyName-error" className="text-xs text-red-500" role="alert">
      {errors.companyName.message}
    </p>
  )
}
```

### États de chargement

```typescript
// Indicateur de chargement pendant les transitions
{
  isTransitioning && (
    <motion.div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-600 font-medium">Chargement...</p>
      </div>
    </motion.div>
  )
}
```

---

## 🎨 Design et animations

### Thème visuel

- **Couleurs** : Palette bleue professionnelle
- **Typographie** : Inter, Poppins, Outfit
- **Style** : Design Apple-like moderne et sobre
- **Responsive** : Adaptation mobile et desktop

### Animations Framer Motion

- **Transitions d'étapes** : Slide horizontal avec fade
- **Hover effects** : Élévation et ombres
- **Loading states** : Spinners et overlays
- **Micro-interactions** : Boutons et champs

### Accessibilité

- **Navigation clavier** : Tab, flèches, Entrée, Échap
- **ARIA labels** : Descriptions pour screen readers
- **Focus management** : Gestion du focus lors des transitions
- **Contraste** : Respect des standards WCAG

---

## 🔧 Personnalisation

### Modifier les étapes

```typescript
// Ajouter une étape
const STEPS = [
  { id: 1, title: 'Votre Entreprise', description: 'Identification' },
  { id: 2, title: 'Contact', description: 'Coordonnées' },
  { id: 3, title: 'Documents', description: 'Justificatifs' },
  { id: 4, title: 'Validation', description: 'Finalisation' }, // Nouvelle étape
]
```

### Changer les champs obligatoires

```typescript
// Modifier la validation d'une étape
const fieldsToValidate: (keyof AccountFormData)[][] = [
  ['companyName', 'siren', 'siret'], // Moins de champs obligatoires
  ['email', 'phone', 'address'], // Plus de champs obligatoires
  ['legalDocument', 'signature'],
]
```

### Personnaliser les messages

```typescript
// Messages d'erreur personnalisés
const VALIDATION_MESSAGES = {
  required: 'Ce champ est obligatoire',
  email: 'Adresse email invalide',
  phone: 'Numéro de téléphone invalide',
  // ... autres messages
}
```

---

Ce guide détaille chaque aspect du formulaire de création de compte professionnel, permettant une compréhension complète du fonctionnement et des possibilités de personnalisation.
