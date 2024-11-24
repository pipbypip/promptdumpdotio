import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add auth state to response headers
  const response = NextResponse.next()
  
  // Protected routes
  const protectedPaths = ['/profile', '/create']
  const path = request.nextUrl.pathname
  
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    // Check for auth token
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
