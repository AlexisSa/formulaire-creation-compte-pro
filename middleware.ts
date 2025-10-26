import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de sécurité pour Next.js App Router (Edge Runtime compatible)
 * Simplifié pour éviter les erreurs dans Edge Runtime
 */
export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()

    // Headers de sécurité (essentiels)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // CSP simplifiée (Edge Runtime compatible)
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
    ].join('; ')

    response.headers.set('Content-Security-Policy', csp)

    return response
  } catch (error) {
    // En cas d'erreur, retourner une réponse simple pour éviter le crash
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

/**
 * Configuration du middleware
 * Applique le middleware à toutes les routes sauf les fichiers statiques
 */
export const config = {
  matcher: [
    /*
     * Appliquer le middleware à toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (icône de site)
     * - api routes (gérées séparément)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
