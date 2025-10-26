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
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.).*)',
  ],
}
