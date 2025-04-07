import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (isPublicPath) {
    if (token) {
      // If user is logged in and tries to access login/register, redirect to lobby
      return NextResponse.redirect(new URL('/lobby', request.url))
    }
    return NextResponse.next()
  }

  // Protected paths
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth_token')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}