'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { Bell, BellRing } from 'lucide-react'

export default function LiveClock() {
  const [now, setNow] = useState(new Date())
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    }
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.')
      return
    }
    const result = await Notification.requestPermission()
    setPermission(result)
  }, [])

  const timeStr = mounted ? format(now, 'hh:mm:ss a') : '--:--:-- --'
  const dateStr = mounted ? format(now, 'EEEE, MMM d yyyy') : 'Loading...'

  return (
    <div className="flex items-center gap-6">
      {/* Notification Toggle */}
      <button 
        onClick={requestNotificationPermission}
        title={permission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
        className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
          permission === 'granted' 
            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80 hover:border-white/30'
        }`}
      >
        {permission === 'granted' ? <BellRing size={18} /> : <Bell size={18} />}
      </button>

      {/* Clock */}
      <div className="text-right border-l border-white/10 pl-6 min-w-[120px]">
        <p className="text-sm font-semibold text-white tabular-nums tracking-wide">
          {timeStr}
        </p>
        <p className="text-[10px] text-white/40 leading-tight">
          {dateStr}
        </p>
      </div>
    </div>
  )
}
