'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Planner', href: '/dashboard/tasks' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Habits', href: '/dashboard/habits' },
  { label: 'Journal', href: '/dashboard/journal' },
  { label: 'Notes + AI', href: '/dashboard/notes' },
  { label: 'Schedule', href: '/dashboard/schedule' },
  { label: 'Bucket List', href: '/dashboard/bucket' },
]

export default function TopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-6 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1 pt-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors relative ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-white'
            } ${
              isActive 
                ? "after:content-[''] after:absolute after:-bottom-7 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-amber-500 after:rounded-full" 
                : ""
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
