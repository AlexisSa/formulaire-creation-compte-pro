# 🔧 Résolution de l'erreur "self is not defined" lors du déploiement

## 📋 Problème

Erreur rencontrée lors du déploiement sur Vercel :

```
unhandledRejection ReferenceError: self is not defined
    at Object.<anonymous> (/vercel/path0/.next/server/vendors.js:1:1)
    ...
Error: Command "npm run build" exited with 1
```

## 🔍 Cause

L'erreur `self is not defined` survient lorsque des **bibliothèques orientées navigateur** (jsPDF, html2canvas, react-signature-canvas) sont **bundlées côté serveur** par webpack.

Le fichier `vendors.js` généré par webpack contient du code qui utilise `self` (variable globale du navigateur) qui n'existe pas dans l'environnement Node.js du serveur.

### Bibliothèques concernées

- `jspdf` - Génération de PDF
- `html2canvas` - Capture d'écran HTML en canvas
- `react-signature-canvas` - Composant de signature

## ✅ Solution

### 1. Import dynamique des modules côté client

Transformez les imports statiques en **imports dynamiques** dans vos composants.

**Avant :**
```typescript
import { generateAccountPDF } from '@/lib/pdf-generator'

// ...
const pdfBlob = await generateAccountPDF(data)
```

**Après :**
```typescript
// Import dynamique pour éviter le chargement côté serveur
const { generateAccountPDF } = await import('@/lib/pdf-generator')

// ...
const pdfBlob = await generateAccountPDF(data)
```

**Fichier modifié :** `components/account-form.tsx`

### 2. Configuration webpack

Modifiez `next.config.js` pour désactiver `splitChunks` côté serveur et exclure les bibliothèques problématiques :

```javascript
webpack: (config, { dev, isServer }) => {
  // Exclure les bibliothèques orientées navigateur du bundle serveur
  if (isServer) {
    // Définir self dans l'environnement global
    if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
      global.self = global
    }

    // Externaliser les bibliothèques orientées navigateur
    config.externals = config.externals || []

    const additionalExternals = {
      jspdf: 'commonjs jspdf',
      'jspdf-autotable': 'commonjs jspdf-autotable',
      html2canvas: 'commonjs html2canvas',
      'react-signature-canvas': 'commonjs react-signature-canvas',
    }

    if (Array.isArray(config.externals)) {
      config.externals.push(additionalExternals)
    } else {
      config.externals = [config.externals, additionalExternals]
    }

    // Désactiver splitChunks côté serveur pour éviter vendors.js
    config.optimization.splitChunks = false
  }

  // Configuration normale pour le client
  else if (!dev) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    }
  }

  return config
}
```

### 3. Vérifier que les composants sont côté client

Assurez-vous que tous les composants utilisant ces bibliothèques ont la directive `'use client'` en haut du fichier :

```typescript
'use client'

import SignatureCanvas from 'react-signature-canvas'
// ...
```

**Fichiers concernés :**
- `components/signature-pad.tsx` - Composant de signature
- `components/account-form.tsx` - Formulaire principal
- Tous les composants utilisant des libs orientées navigateur

## 🧪 Vérification

Pour vérifier que la solution fonctionne :

```bash
# Nettoyer le cache
rm -rf .next

# Lancer le build
npm run build

# Si succès, vous devriez voir :
# ✓ Compiled successfully
# ✓ Generating static pages
# ✓ Finalizing page optimization
```

## 📝 Notes importantes

1. **Import dynamique uniquement quand nécessaire** : N'utilisez l'import dynamique que pour les bibliothèques vraiment problématiques (jsPDF, html2canvas, etc.)

2. **Performance** : L'import dynamique peut légèrement affecter les performances initiales, mais c'est nécessaire pour éviter l'erreur de build

3. **Externalisation** : Les bibliothèques sont exclues du bundle serveur mais toujours disponibles côté client

4. **Vercel** : Cette solution fonctionne sur Vercel et autres plateformes de déploiement

## 🚨 Si l'erreur persiste

1. Vérifiez que tous les imports de bibliothèques problématiques sont dynamiques
2. Assurez-vous que les composants ont `'use client'`
3. Nettoyez le cache : `rm -rf .next node_modules/.cache`
4. Vérifiez que `next.config.js` contient bien les modifications

---

## 🚨 Erreur 2 : `MIDDLEWARE_INVOCATION_FAILED` (Edge Runtime)

### Problème

```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
```

### Cause

Le middleware utilise des **APIs Node.js** incompatibles avec **Edge Runtime** de Vercel.

**APIs interdites dans Edge Runtime :**
- ❌ `fs`, `path`, `crypto`, `Buffer` (APIs Node.js)
- ❌ `process.env` (lecture directe)
- ❌ `__dirname`, `__filename`
- ❌ `require()` dynamique

**APIs autorisées (Web APIs) :**
- ✅ `fetch`, `Request`, `Response`
- ✅ `Headers`, `URL`, `URLSearchParams`
- ✅ `TextEncoder`, `TextDecoder`
- ✅ APIs Web standards

### Solution

**Middleware Edge-compatible :**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge-compatible middleware
 * Only uses Web APIs available in Edge Runtime
 */
export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Add security headers (Edge-compatible)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.).*)',
  ],
}
```

### Règles à respecter

1. ❌ **Ne PAS utiliser Node.js APIs** (`fs`, `path`, `crypto`, etc.)
2. ❌ **Ne PAS lire `process.env` directement**
3. ✅ **Utiliser uniquement Web APIs** standard
4. ✅ **Utiliser `Headers` au lieu de manipulation manuelle**
5. ✅ **Tester le middleware en production** (pas seulement en dev)

### Alternative : Routes API au lieu du Middleware

Si vous avez besoin de logique complexe, utilisez des **Routes API** (Node.js Runtime) :

```typescript
// app/api/middleware-check/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs' // ✅ OK ici (Node.js Runtime)

export async function POST(request: NextRequest) {
  // Logique complexe avec APIs Node.js ici
  return NextResponse.json({ success: true })
}
```

### ✅ Solution Ultime : Supprimer le Middleware

**Si vous n'avez pas besoin de logique complexe dans le middleware**, la meilleure solution est de **supprimer complètement le middleware** et utiliser la configuration `headers()` dans `next.config.js`.

**Pourquoi ?**
- ✅ Plus simple et plus robuste
- ✅ Pas d'erreurs Edge Runtime
- ✅ Même fonctionnalité (headers de sécurité)
- ✅ Moins de complexité

**Avant (middleware.ts) :**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
}
```

**Après (next.config.js) :**
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ]
}
```

**Résultat :**
- ✅ Même sécurité
- ✅ Pas d'erreur `MIDDLEWARE_INVOCATION_FAILED`
- ✅ Build plus rapide
- ✅ Code plus maintenable

---

## 🔗 Références

- [Next.js - Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js - Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Webpack - Externals](https://webpack.js.org/configuration/externals/)
- [Vercel - Deploy Next.js](https://vercel.com/docs/frameworks/nextjs)
- [Vercel - Edge Middleware](https://vercel.com/docs/functions/edge-functions)
