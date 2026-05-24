import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LiveClock from '@/components/dashboard/LiveClock'
import TaskNotifier from '@/components/dashboard/TaskNotifier'
import LogoutButton from '@/components/auth/LogoutButton'
import TopNav from '@/components/dashboard/TopNav'
import MobileNav from '@/components/dashboard/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const userName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'User'

  const avatarUrl = user.user_metadata?.avatar_url ?? null

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <TaskNotifier />

      {/* Top Navigation Bar */}
      <header className="h-20 px-4 md:px-8 lg:px-12 flex items-center justify-between border-b border-white/5 shrink-0 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-4 md:gap-12">
          <MobileNav />
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center hidden md:flex"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <span className="text-sm font-bold text-slate-900">A</span>
            </div>
          </div>
        </div>

        {/* Nav Links (Centered on Desktop) */}
        <div className="hidden xl:flex flex-1 justify-center px-8">
          <TopNav />
        </div>
        <div className="hidden md:flex xl:hidden flex-1 justify-start px-8">
          <TopNav />
        </div>

        <div className="flex items-center gap-4">
          <LiveClock />
          
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-900"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
              >
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs font-medium text-white pr-2">{userName}</span>
          </div>
          
          <LogoutButton />
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-12">
        {children}
      </main>
    </div>
  )
}
