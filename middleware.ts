import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de sécurité pour Next.js App Router (Edge Runtime compatible)
 */
export function securityMiddleware(request: NextRequest): NextResponse | null {
  const response = NextResponse.next()

  // Headers de sécurité
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Validation de l'origine pour les requêtes POST/PUT/DELETE (uniquement pour les routes externes)
  const url = request.nextUrl.pathname

  // Ne bloquer que les routes API externes, pas les routes internes
  if (
    ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) &&
    !url.startsWith('/api/') &&
    process.env.NODE_ENV === 'production'
  ) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3005',
    ]

    if (origin && !allowedOrigins.includes(origin)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Origine non autorisée',
          message: "Requête provenant d'une origine non autorisée.",
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
  }

  return response
}

/**
 * Middleware principal pour Next.js
 */
export function middleware(request: NextRequest) {
  // Appliquer le middleware de sécurité
  const securityResponse = securityMiddleware(request)
  if (securityResponse) {
    return securityResponse
  }

  // Continuer avec la requête normale
  return NextResponse.next()
}

/**
 * Configuration du middleware
 */
export const config = {
  matcher: [
    /*
     * Appliquer le middleware à toutes les routes sauf :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (icône de site)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
