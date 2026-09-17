import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Basic auth guard for user routes
  // NOTE: this duplicates the server-side check in the layout files.
  // We keep both because the layout checks are more robust (session validation),
  // but the middleware gives us a faster redirect for unauthenticated users.
  const token = request.cookies.get('next-auth.session-token')

  if (request.nextUrl.pathname.startsWith('/user') && !token) {
    return NextResponse.redirect(new URL('/user/login', request.url))
  }

  // Admin route stub — not yet implemented but route exists in router
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
}
