import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  // Refresh session — IMPORTANT: do not remove, keeps session alive
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthRoute = url.pathname.startsWith('/login')
  const isPublicRoute = url.pathname.startsWith('/u/')
  const isApiRoute = url.pathname.startsWith('/api/')
  const isCallbackRoute = url.pathname.startsWith('/auth/callback')

  // Redirect unauthenticated users away from protected routes
  if (!user && !isAuthRoute && !isPublicRoute && !isApiRoute && !isCallbackRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from /login
  if (user && isAuthRoute) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
