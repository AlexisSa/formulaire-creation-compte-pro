import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge-compatible middleware
 * CRITICAL: Cannot import ANY Node.js APIs (fs, crypto, path, etc.)
 * Only Web APIs are available: fetch, Headers, URL, etc.
 */
export function middleware(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.next()

    // Add security headers (Edge-compatible)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')

    return response
  } catch (error) {
    // Fallback: return basic response if anything fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    // Exclude static files and API routes
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.).*)',
  ],
}
