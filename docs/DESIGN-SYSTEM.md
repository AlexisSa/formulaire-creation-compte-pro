# Design System - XEILOM

Document de référence pour maintenir la cohérence visuelle et interactionnelle entre les applications XEILOM.

## Table des matières

1. [Philosophie de design](#philosophie-de-design)
2. [Couleurs](#couleurs)
3. [Typographie](#typographie)
4. [Espacements](#espacements)
5. [Bordures et rayons](#bordures-et-rayons)
6. [Ombres](#ombres)
7. [Animations](#animations)
8. [Composants UI](#composants-ui)
9. [Accessibilité](#accessibilité)
10. [Responsive Design](#responsive-design)
11. [Patterns d'interface](#patterns-dinterface)

---

## Philosophie de design

### Principe fondateur

**Design sobre, moderne et professionnel** - Les applications XEILOM privilégient la clarté, la lisibilité et l'efficacité.

### Principes clés

- **Simplicité** : Interface épurée, sans fioritures inutiles
- **Cohérence** : Utilisation systématique des mêmes composants et styles
- **Accessibilité** : Respect des standards WCAG 2.1 niveau AA
- **Performance** : Optimisation pour les appareils mobiles
- **Moderne mais sobre** : Éviter les tendances passagères, privilégier la durabilité

### Thème

- **Mode clair** : Thème principal et unique
- **Pas de mode sombre** : Cohérence visuelle via le mode clair uniquement

---

## Couleurs

### Palette principale

#### Couleurs sémantiques

```css
/* Couleur primaire - Bleu XEILOM */
--primary: hsl(221.2, 83.2%, 53.3%)
--primary-foreground: hsl(210, 40%, 98%)

/* Couleur secondaire */
--secondary: hsl(210, 40%, 96%)
--secondary-foreground: hsl(222.2, 84%, 4.9%)

/* Couleur destructive */
--destructive: hsl(0, 84.2%, 60.2%)
--destructive-foreground: hsl(210, 40%, 98%)

/* Couleurs neutres */
--background: hsl(0, 0%, 100%)
--foreground: hsl(222.2, 84%, 4.9%)
--muted: hsl(210, 40%, 96%)
--muted-foreground: hsl(215.4, 16.3%, 46.9%)
--accent: hsl(210, 40%, 96%)
--accent-foreground: hsl(222.2, 84%, 4.9%)

/* Bordures et inputs */
--border: hsl(214.3, 31.8%, 91.4%)
--input: hsl(214.3, 31.8%, 91.4%)
--ring: hsl(221.2, 83.2%, 53.3%)
```

#### Nuances de bleu (Radix UI)

```css
--blue-1: hsl(206, 100%, 95.8%)  /* Très clair */
--blue-2: hsl(206, 100%, 92.6%)
--blue-3: hsl(206, 100%, 87.1%)
--blue-4: hsl(206, 100%, 80.2%)
--blue-5: hsl(206, 100%, 72.2%)
--blue-6: hsl(206, 100%, 63.1%)  /* Moyen */
--blue-7: hsl(206, 100%, 53.1%)
--blue-8: hsl(206, 100%, 45.1%)
--blue-9: hsl(206, 100%, 37.1%)  /* Principal */
--blue-10: hsl(206, 100%, 30.2%)
--blue-11: hsl(206, 100%, 23.1%)
--blue-12: hsl(206, 100%, 15.1%) /* Très sombre */
```

#### Nuances de gris

```css
--gray-1: hsl(0, 0%, 99.4%)   /* Fond très clair */
--gray-2: hsl(0, 0%, 98.4%)
--gray-3: hsl(0, 0%, 96.9%)
--gray-4: hsl(0, 0%, 94.9%)
--gray-5: hsl(0, 0%, 92.4%)
--gray-6: hsl(0, 0%, 89.4%)
--gray-7: hsl(0, 0%, 85.4%)   /* Bordures */
--gray-8: hsl(0, 0%, 80.4%)
--gray-9: hsl(0, 0%, 69.4%)   /* Texte secondaire */
--gray-10: hsl(0, 0%, 59.4%)
--gray-11: hsl(0, 0%, 49.4%)  /* Texte principal */
--gray-12: hsl(0, 0%, 39.4%)  /* Texte accentué */
```

#### Nuances de vert (succès)

```css
--green-1: hsl(116, 50%, 98.9%)
--green-6: hsl(124, 39%, 79.7%)
--green-9: hsl(131, 41%, 46.5%)  /* Principal */
```

### Utilisation Tailwind CSS

```jsx
// Bouton primaire
className = 'bg-blue-600 text-white hover:bg-blue-700'

// Texte secondaire
className = 'text-gray-600'

// Bordures
className = 'border border-gray-200'

// Fond de section
className = 'bg-gray-50'
```

### Cartes de couleur de référence

| Usage             | Couleur     | Classe Tailwind      | Variable CSS         |
| ----------------- | ----------- | -------------------- | -------------------- |
| Action principale | Bleu 600    | `bg-blue-600`        | `--blue-9`           |
| Action au survol  | Bleu 700    | `bg-blue-700`        | `--blue-8`           |
| Texte principal   | Gris 900    | `text-gray-900`      | `--foreground`       |
| Texte secondaire  | Gris 600    | `text-gray-600`      | `--muted-foreground` |
| Bordures          | Gris 200    | `border-gray-200`    | `--border`           |
| Fond de section   | Gris 50     | `bg-gray-50`         | `--secondary`        |
| Participants      | Orange 500  | `border-orange-500`  | -                    |
| Validation        | Emerald 500 | `border-emerald-500` | -                    |

---

## Typographie

### Familles de polices

#### Configuration des polices

```javascript
// Google Fonts utilisées
- Space Grotesk: Tous et titres d'affichage (display)
Electronique :
- Plus Jakarta Sans: Titres principaux (heading)
- DM Sans: Corps de texte (body, sans)
```

#### Classes CSS

```css
font-display: 'var(--font-space-grotesk)'
font-heading: 'var(--font-plus-jakarta)'
font-body: 'var(--font-dm-sans)'
font-sans: 'var(--font-dm-sans)' (par défaut)
```

### Hiérarchie typographique

#### Titres

```jsx
// Titre H1 - Hero section
className =
  'text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 tracking-tight leading-[1.1]'

// Titre H1 - Page standard
className = 'text-6xl font-light text-gray-900 mb-8 tracking-tight'

// Titre H2 - Section
className = 'text-5xl font-light text-gray-900 mb-6 tracking-tight'

// Titre H3 - Carte
className = 'text-2xl font-medium text-gray-900 tracking-tight'

// Titre H4
className = 'text-xl font-semibold text-gray-900 tracking-tight'
```

#### Corps de texte

```jsx
// Large - Hero
className = 'text-lg md:text-xl text-gray-700 leading-relaxed'

// Normal
className = 'text-base text-gray-600 leading-relaxed'

// Petit - Métadonnées
className = 'text-sm text-gray-600'
```

### Styles de texte

```jsx
// Police légère (light)
className = 'font-light'

// Police normale
className = 'font-normal'

// Police medium
className = 'font-medium'

// Police semi-bold (semibold)
className = 'font-semibold'

// Texte avec gradient bleu
className = 'text-gradient' // Défini dans globals.css
```

### Exemples d'utilisation

#### Hero section

```jsx
<h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-[1.1]">
  Votre partenaire <span className="text-blue-600">courant faible</span>
</h1>
<p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
  Une équipe dédiée, des conditions de paiement flexibles...
</p>
```

#### Section

```jsx
<h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
  Créez votre compte en quelques minutes
</h2>
<p className="text-xl text-gray-600 font-light">
  Un processus simple en 3 étapes
</p>
```

---

## Espacements

### Système d'espacement (échelle 4px)

```
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
16 = 4rem (64px)
20 = 5rem (80px)
24 = 6rem (96px)
32 = 8rem (128px)
```

### Espacements de section

```jsx
// Padding vertical standard
className = 'py-12 md:py-16 lg:py-20'

// Padding horizontal vanilla
className = 'px-4 sm:px-6 lg:px-8'

// Container responsive
className = 'max-w-7xl mx-auto px-8'

// Espacement entre éléments
className = 'space-y-4' // Vertical
className = 'gap-8' // Grid/Flex
```

### Marges standardisées

```jsx
// Espacement sous un titre
className="mb-6"   // Titre de section
className="mb-8"反映了 // Titre principal
className="mb-12"  // Hero CTA

// Espacement sous un paragraphe
className="mb-4"   // Normale
className="mb-8"   // Large
```

### Classes utilitaires

```jsx
className = 'container-responsive' // Container avec padding responsive
className = 'section-padding' // Padding vertical standardisé
```

---

## Bordures et rayons

### Rayons de bordure

```css
--radius: 0.5rem (8px);
```

```jsx
// Variantes de rayon
className = 'rounded-sm' // calc(var(--radius) - 4px)
className = 'rounded-md' // calc(var(--radius) - 2px)
className = 'rounded-lg' // var(--radius) 0.5rem
className = 'rounded-xl' // 12px
className = 'rounded-2xl' // 16px
className = 'rounded-3xl' // 24px
className = 'rounded-full' // 100%
```

### Bordures

```jsx
// Standard
className = 'border border-gray-200'

// Au survol
className = 'hover:border-blue-200'

// Focus
className = 'focus:border-blue-500'

// États
className = 'border-blue-500' // Bleu
className = 'border-emerald-500' // Vert
className = 'border-orange-500' // Orange
className = 'border-red-500' // Erreur
```

### Bordures personnalisées

```jsx
className = 'border-2' // Bordures épaisses
```

---

## Ombres

### Niveaux d'ombres

```css
.shadow-xs {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-s {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}
.shadowود-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.shadow-m {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
```

### Usage

```jsx
// Cartes statiques
className = 'shadow-sm'

// Cartes au survol
className = 'hover:shadow-md hover:-translate-y-1'

// Modales
className = 'shadow-lg'

// Header fixe
className = 'shadow-sm border-b'
```

---

## Animations

### Durées standardisées

```javascript
// Transitions rapides
duration - 150 // 150ms
duration - 200 // 200ms
duration - 300 // 300ms (standard)

// Transitions normales
duration - 500 // 500ms
duration - 700 // 700ms

// Animations
duration - 800 // 800ms
```

### Courbes d'animation

```javascript
// Standard
ease-in-out

// Smooth (préféré)
ease: [0.22, 1, 0.36, 1]

// Spring
ease: [0.34, 1.56, 0.64, 1]
```

### Animations entrantes

#### Fade In

```jsx
// CSS
className="animate-fade-in"  // 0.5s ease-in-out

// Framer Motion
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6, delay: 0.1 }}
```

#### Slide Up

```jsx
// CSS
className="animate-slide-up"  // 0.5s ease-out

// Framer Motion
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, delay: 0.2 }}
```

#### Scale In

```jsx
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
```

### Effets au survol

```jsx
// Bouton
className =
  'transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md'

// Carte
className = 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1'

// Lien
className = 'transition-colors duration-300 hover:text-blue-600'
```

### Animations de progression

```jsx
// Pulse
className = 'animate-pulse'

// Spin
className = 'animate-spin'
```

### Réduction de mouvement

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Composants UI

### Bouton

#### Variantes

```jsx
// Default (primaire)
<Button>Devenir client en compte</Button>

// Outline
<Button variant="outline">Télécharger</Button>

// Ghost
<Button variant="ghost">Voir plus</Button>

// Destructif
<Button variant="destructive">Supprimer</Button>

// Secondaire
<Button variant="secondary">Annuler</Button>
```

#### Tailles

```jsx
<Button size="sm">Petit</Button>
<Button size="default">Normal</Button>
<Button size="lg">Large</Button>
```

#### Structure

```tsx
// Classes principales
className="inline-flex items-center justify-center
  whitespace-nowrap rounded-lg text-sm font-medium
  ring-offset-background transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-primary/20 disabled:opacity-50"

// Styles variants
default: "bg-blue-600 text-white hover:bg-blue-700"
outline: "border border-gray-300 bg-white hover:bg-gray-50"
ghost: "hover:bg-gray-100"
destructive: "bg-red-600 text-white hover:bg-red-700"
```

### Input

#### Usage de base

```jsx
<Input
  type="text"
  label="Nom de l'entreprise"
  required
  error={hasError}
  helperText="Texte d'aide optionnel"
/>
```

#### Structure

```tsx
// Classes principales
className="flex h-10 w-full rounded-md border border-input
  bg-background px-3 py-2 text-sm ring-offset-background
  placeholder:text-muted-foreground
  focus-visible:outline-none focus-visible:ring-2
  focus-visible:ring-ring disabled:opacity-50"

// État d'erreur
className="border-red-500 ring-2 ring-red-200"
```

### Card

#### Usage

```jsx
<Card className="hover:border-blue-200 transition-all duration-300">
  <CardHeader>
    <CardTitle>Équipe dédiée</CardTitle>
    <CardDescription>Description de la fonctionnalité</CardDescription>
  </CardHeader>
  <CardContent>Contenu de la carte</CardContent>
</Card>
```

#### Structure

```tsx
// Card principale
className = 'rounded-lg border bg-card text-card-foreground shadow-sm'

// Header
className = 'flex flex-col space-y-1.5 p-6'

// Title
className = 'text-2xl font-semibold leading-none tracking-tight'

// Content
className = 'p-6 pt-0'
```

### Dialog (Modal)

#### Usage

```jsx
<Dialog>
  <DialogTrigger>Ouvrir</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Fermer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Stepper (Indicateur d'étapes)

#### Style

```jsx
// Cercle d'étape
className="w-32 h-32 rounded-full bg-white border-2
  border-blue-500 flex items-center justify-center
  transition-all duration-300 shadow-sm hover:shadow-md"

// Numéro
className="text-5xl font-light text-blue-600"
```

---

## Accessibilité

### Principes WCAG 2.1 AA

#### Contraste des couleurs

- Texte normal : ratio minimum 4.5:1
- Texte large : ratio minimum 3:1
- Éléments interactifs : bordure visible au focus

#### État de focus

```css
/* Focus visible standard */
.focus-visible:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Focus avec ring Tailwind */
className="focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
```

#### Navigation clavier

- Ordre de tabulation logique
- Focus trap dans les modales
- Esc pour fermer les modales

#### ARIA

```jsx
// Labels
<label htmlFor="input-id">Nom</label>

// Descriptions
<p id="helper-id">Texte d'aide</p>
<input aria-describedby="helper-id" />

// États
<input aria-invalid={error} />

// Boutons
<button aria-label="Fermer" />

// Landmarks
<header role="banner">
<main role="main">
<footer role="contentinfo">
```

#### Réduction de mouvement

```jsx
// Respecter prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Lecteurs d'écran

```jsx
// Masquer visuellement
<span className="sr-only">Texte pour lecteurs d'écran</span>

// Annoncer les changements
<div role="status" aria-live="polite">
  Message affiché
</div>
```

### Exemple complet

```jsx
<button
  className="focus:outline-none focus:ring-2 focus:ring-primary/20"
  aria-label="Devenir client en compte"
  aria-describedby="button-help"
>
  Devenir client en compte
</button>
<span id="button-help" className="sr-only">
  Ouvre le formulaire d'inscription
</span>
```

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Mobile paysage */
md: 768px   /* Tablette */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Approche mobile-first

```jsx
// Base (mobile)
className = 'text-base'

// Desktop
className = 'text-base md:text-lg lg:text-xl'

// Padding responsive
className = 'px-4 sm:px-6 lg:px-8'
className = 'py-12 md:py-16 lg:py-20'
```

### Grid responsif

```jsx
// Colonnes adaptatives
className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'

// Container
className = 'max-w-7xl mx-auto px-8'
```

### Texte responsive

```jsx
// Titre Hero
className = 'text-5xl sm:text-6xl md:text-7xl'

// Corps de texte
className = 'text-lg md:text-xl'
```

### Touch targets

```css
/* Minimum 44x44px sur mobile */
@media (pointer: coarse) {
  button,
  a,
  [role='button'] {
    min-height: 44px;
    min-width: 44px;
  }
}
```

### Optimisations mobile

```jsx
// Scroll horizontal optimisé
className = 'scroll-horizontal'

// Scrollbar masquée
className = 'scroll-horizontal' // Défini dans globals.css

// Forcer le GPU
className = 'mobile-optimized'

// Mode paysage
className = 'landscape-hide' // Cacher en paysage
className = 'landscape-compact' // Compacter
```

---

## Patterns d'interface

### Hero Section

#### Structure

```jsx
<section className="pt-20 md:pt-20 pb-16 text-center">
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
    {/* Label */}
    <div
      className="inline-flex items-center gap-2.5 px-6 py-2.5 
      bg-blue-50 rounded-full mb-12"
    >
      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
      <span className="text-sm font-medium text-blue-900">Label</span>
    </div>

    {/* Titre */}
    <h1
      className="text-5xl sm:text-6xl md:text-7xl font-light 
      text-gray-900 mb-8 tracking-tight"
    >
      Titre <span className="text-blue-600">Accentué</span>
    </h1>

    {/* Description */}
    <p
      className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto 
      mb-12 leading-relaxed"
    >
      Description
    </p>

    {/* CTA */}
    <Button size="lg">Action principale</Button>
  </motion.div>
</section>
```

### Section de cartes

#### Grid 3 colonnes

```jsx
<section className="pb-32 pt-0">
  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {features.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -2 }}
        className="h-full p-8 bg-white rounded-xl border border-gray-200 
          hover:border-blue-200 transition-all duration-300 hover:shadow-md"
      >
        {/* Icône */}
        <div
          className="w-12 h-12 bg-blue-50 rounded-lg flex items-center 
          justify-center mb-6"
        >
          <Icon className="h-6 w-6 text-blue-600" />
        </div>

        {/* Titre */}
        <h3
          className="text-xl font-semibold text-gray-900 mb-3 
          tracking-tight"
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
      </motion.div>
    ))}
  </div>
</section>
```

### Carrousel de témoignages

#### Structure

```jsx
<section className="my-32 py-16 md:py-24 bg-gray-50 rounded-3xl">
  <div className="max-w-5xl mx-auto px-6 md:px-12">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
        Témoignages
      </h2>
    </div>

    {/* Navigation */}
    <button
      className="absolute left-0 top-[35%] z-10 w-10 h-10 
      bg-white rounded-full shadow-lg hover:bg-gray-50"
    >
      <ChevronLeft />
    </button>

    {/* Carte témoignage */}
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm">{/* Contenu */}</div>

    {/* Dots */}
    <div className="flex justify-center gap-2 mt-8">
      {items.map((_, index) => (
        <button
          className={`transition-all duration-300 rounded-full ${
            index === current ? 'w-8 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  </div>
</section>
```

### FAQ (Accordéon)

#### Structure

```jsx
<div className="border-b border-gray-200 last:border-0">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="w-full px-8 py-6 flex items-center justify-between text-left
      group hover:text-blue-600 transition-colors duration-300"
  >
    <h3 className="text-lg font-medium text-gray-900
      group-hover:text-blue-600 pr-8">
      {question}
    </h3>
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <ChevronDown className="h-5 w-5 text-gray-400" />
    </motion.div>
  </button>
  <motion.div
    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
    transition={{ duration: 0. একটি }}
  >
    <div className="px-8 pb-8 text-gray-600 font-light">
      {answer}
    </div>
  </motion.div>
</div>
```

### Header fixe

#### Structure

```jsx
<header
  className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm 
  border-b border-gray-100"
>
  <div className="max-w-7xl mx-auto px-8">
    <div className="flex items-center justify-between h-20">
      {/* Logo */}
      <Image src="/logo.png" alt="Logo" width={120} height={40} />

      {/* Navigation */}
      <nav className="flex items-center gap-6">{/* Items */}</nav>
    </div>
  </div>
</header>
```

---

## Checklist de cohérence

### Couleurs

- [ ] Utiliser les couleurs du design system (HSL via variables CSS)
- [ ] Respecter les contrastes d'accessibilité (4.5:1 minimum)
- [ ] Utiliser le bleu #3b82f6 comme couleur principale
- [ ] Ne pas utiliser de couleurs sombres (pas de mode dark)

### Typographie

- [ ] Utiliser les familles de polices définies (DM Sans, Plus Jakarta Sans)
- [ ] Respecter la hiérarchie (H1 > H2 > H3)
- [ ] Utiliser font-light pour les titres
- [ ] Espacement de ligne leading-relaxed pour le corps

### Espacements

- [ ] Utiliser le système d'espacement par défaut (4px)
- [ ] Padding vertical standard : py-12 md:py-16 lg:py-20
- [ ] Container : max-w-7xl mx-auto px-8

### Animations

- [ ] Durée standard : paragraph-300ms
- [ ] Courbe préférée : ease [0.22, 1, 0.36, 1]
- [ ] Respecter prefers-reduced-motion
- [ ] Animer avec Framer Motion si disponible

### Accessibilité

- [ ] Focus visible sur tous les éléments interactifs
- [ ] Labels ARIA appropriés
- [ ] Contraste des couleurs respecté
- [ ] Navigation clavier fonctionnelle
- [ ] Min 44x44px pour les touch targets

### Responsive

- [ ] Approche mobile-first
- [ ] Breakpoints respectés (sm, md, lg)
- [ ] Texte responsive
- [ ] Grid adaptatif

---

## Ressources

### Fichiers de référence

- `tailwind.config.ts` - Configuration Tailwind
- `app/globals.css` - Styles globaux et utilitaires
- `src/components/ui/*` - Composants UI de base
- `src/components/landing-page.tsx` - Exemple d'implémentation

### Outils

- **Tailwind CSS** - Framework de styles
- **Framer Motion** - Animations
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes

### Design Tokens

Tous les tokens de design sont définis dans `tailwind.config.ts` et probabilisés dans `app/globals.css`.

---

## Changelog

### Version 1.0.0 - 2024

- Création du design system
- Définition de la palette de couleurs
- Système typographique
- Composants UI de base
- Guidelines d'accessibilité et responsive

---

**Note** : Ce document est évolutif et doit être mis à jour lors de tout changement majeur dans le design system.
