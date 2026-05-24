'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PomodoroTimer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)

  const handleSessionComplete = useCallback(async () => {
    const durationMins = 25
    
    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: durationMins })
      })
      
      setSessionCount(prev => prev + 1)
      setTimeLeft(5 * 60)
      router.refresh()
    } catch (e) {
      console.error(e)
    }
  }, [router])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      handleSessionComplete()
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft, handleSessionComplete])

  const toggleTimer = () => setIsActive(!isActive)
  
  const stopTimer = () => {
    setIsActive(false)
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const progress = 100 - (timeLeft / (25 * 60)) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 z-50 shadow-2xl flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-6 text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              <Flame size={14} />
              <span className="text-xs font-medium uppercase tracking-widest">Deep Work</span>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle 
                  cx="96" cy="96" r="88" 
                  className="fill-none stroke-white/5" 
                  strokeWidth="8"
                />
                <circle 
                  cx="96" cy="96" r="88" 
                  className="fill-none stroke-amber-500 transition-all duration-1000 ease-linear" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={(2 * Math.PI * 88) * (1 - progress / 100)}
                />
              </svg>
              <h2 className="text-5xl font-light text-white tracking-tight">
                {formatTime(timeLeft)}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={toggleTimer}
                className="w-14 h-14 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                {isActive ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
              </button>
              
              <button 
                onClick={stopTimer}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:text-white hover:bg-white/10 transition-colors"
              >
                <Square size={18} className="fill-current" />
              </button>
            </div>
            
            <p className="mt-6 text-xs text-slate-500 font-medium tracking-wide">
              {sessionCount} Sessions Completed Today
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
