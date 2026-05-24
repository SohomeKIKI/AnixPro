'use client'

import { motion } from 'framer-motion'
import { signInWithGoogle } from '@/lib/auth/actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function ErrorBanner({ error }: { error: string }) {
  const messages: Record<string, string> = {
    oauth_failed: 'Google sign-in failed. Please try again.',
    auth_callback_failed: 'Authentication failed. Please try again.',
    default: 'Something went wrong. Please try again.',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm px-4 py-3 rounded-xl text-sm text-red-300 border border-red-500/20 mb-4"
      style={{ background: 'rgba(239,68,68,0.08)' }}
    >
      {messages[error] ?? messages.default}
    </motion.div>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex flex-col items-center w-full max-w-sm">
      {error && <ErrorBanner error={error} />}

      {/* Main Login Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome back</h2>
            <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
              Sign in to access your intelligent workspace and continue building your habits.
            </p>
          </div>

          <form action={signInWithGoogle}>
            <button
              type="submit"
              id="google-signin-btn"
              className="group relative w-full flex items-center justify-center gap-4 py-4 px-6 rounded-2xl font-semibold text-[15px] transition-all duration-300 border border-white/10 hover:border-[#ff5151]/50 hover:shadow-[0_0_40px_rgba(255,81,81,0.2)] overflow-hidden bg-white/[0.03]"
            >
              {/* Button hover glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff5151]/0 via-[#ff5151]/15 to-[#ff933b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <GoogleIcon />
              <span className="text-slate-200 group-hover:text-white transition-colors duration-300 relative z-10">
                Continue with Google
              </span>
            </button>
          </form>

          <div className="mt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <p className="text-xs text-slate-500 text-center leading-relaxed">
              By continuing, you agree to our<br />
              <span className="text-slate-400 hover:text-[#ff933b] cursor-pointer transition-colors duration-200">Terms of Service</span>
              {' & '}
              <span className="text-slate-400 hover:text-[#ff933b] cursor-pointer transition-colors duration-200">Privacy Policy</span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-600"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured by Supabase Auth
      </motion.div>
    </div>
  )
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="w-8 h-8 border-2 border-[#ff5151] border-t-transparent rounded-full animate-spin" />}>
      <LoginContent />
    </Suspense>
  )
}
