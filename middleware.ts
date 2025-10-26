import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware de sécurité pour Next.js App Router
 * TRÈS SIMPLIFIÉ pour éviter les erreurs dans Edge Runtime
 */
export function middleware(request: NextRequest) {
  // Middleware minimal juste pour les headers de sécurité
  const response = NextResponse.next()
  
  // Headers de sécurité de base
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}

export const config = {
  matcher: [
    // Appliquer uniquement aux pages principales
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
}
