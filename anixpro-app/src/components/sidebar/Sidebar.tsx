'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Target,
  BookOpen,
  StickyNote,
  Activity,
  Globe,
  Settings,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', href: '/dashboard/tasks', icon: Calendar },
  { label: 'Habits', href: '/dashboard/habits', icon: Activity },
  { label: 'Journal', href: '/dashboard/journal', icon: BookOpen },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { label: 'Goals', href: '/dashboard/bucket', icon: Target },
  { label: 'Notes', href: '/dashboard/notes', icon: StickyNote },
  { label: 'Schedule', href: '/dashboard/schedule', icon: Globe },
]

const bottomItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface SidebarProps {
  userName?: string | null
  avatarUrl?: string | null
}

export default function Sidebar({ userName, avatarUrl }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40 border-r"
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <span className="text-sm font-bold text-slate-900">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">AnixPro</p>
            <p className="text-[10px] text-slate-500 leading-tight">AI Life Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={
                isActive
                  ? {
                      background: 'rgba(245,158,11,0.12)',
                      borderLeft: '2px solid #f59e0b',
                    }
                  : {}
              }
            >
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all duration-150"
              style={{ background: 'transparent' }}
            >
              <Icon size={17} strokeWidth={1.8} />
              {item.label}
            </Link>
          )
        })}

        {/* User chip */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-2"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName ?? 'User'}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-slate-900"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              {userName?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {userName ?? 'User'}
            </p>
            <p className="text-[10px] text-slate-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
