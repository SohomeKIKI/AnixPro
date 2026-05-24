import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { Sparkles, Zap, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In — AniXPro',
  description: 'Sign in to your AniXPro AI Life Dashboard.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#080c1f] relative overflow-hidden p-4 sm:p-8">
      <BackgroundBeams className="opacity-60" />
      
      {/* Massive Central Glass Panel */}
      <div className="relative z-10 w-full max-w-6xl min-h-[600px] flex flex-col lg:flex-row rounded-[2.5rem] bg-[#080c1f]/80 backdrop-blur-3xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Left Panel: Branding & Features */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-[#080c1f]">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ff5151]/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-32 lg:w-48 mb-12">
               {/* Rounded corners added to the logo image */}
               <img 
                 src="/testlogo 3.png" 
                 alt="AniXPro" 
                 className="w-full h-auto object-contain rounded-3xl"
               />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5151] to-[#ff933b]">
                intelligent life.
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
              The all-in-one AI dashboard designed to automate your habits, analyze your journal, and keep you relentlessly focused.
            </p>
          </div>

          <div className="relative z-10 mt-16 space-y-5">
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ff5151]">
                <Zap size={18} />
              </div>
              <span className="font-medium">Lightning fast workflow</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ff933b]">
                <Sparkles size={18} />
              </div>
              <span className="font-medium">AI-powered insights</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={18} />
              </div>
              <span className="font-medium">Enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex-[0.8] bg-black/40 border-l border-white/5 p-10 lg:p-16 flex items-center justify-center relative">
          {/* Top highlight line for depth */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff5151]/20 to-transparent" />
          
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
