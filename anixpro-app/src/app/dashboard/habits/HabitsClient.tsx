'use client'

import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Zap, Flame, Trash2 } from 'lucide-react'
import HabitAnalytics from '@/components/dashboard/HabitAnalytics'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface HabitLog {
  id: string
  date: string
  completed: boolean
}

interface Habit {
  id: string
  title: string
  frequency: string
  icon: string
  logs: HabitLog[]
}

export default function HabitsClient() {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const { data: habits, mutate } = useSWR<Habit[]>('/api/habits/all', fetcher)

  const todayStr = new Date().toISOString().split('T')[0]

  const handleToggle = async (habitId: string) => {
    setLoading(habitId)
    
    // Optimistic UI update
    const previousHabits = habits
    
    if (habits) {
      mutate(habits.map(h => {
        if (h.id !== habitId) return h
        const hasLoggedToday = h.logs.some(l => l.date.split('T')[0] === todayStr)
        
        let newLogs = [...h.logs]
        if (hasLoggedToday) {
          newLogs = newLogs.filter(l => l.date.split('T')[0] !== todayStr)
        } else {
          newLogs.push({ id: 'temp', date: new Date().toISOString(), completed: true })
        }
        return { ...h, logs: newLogs }
      }), false)
    }

    try {
      await fetch('/api/habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: new Date().toISOString() })
      })
      mutate()
    } catch (error) {
      console.error('Failed to toggle habit', error)
      mutate(previousHabits) // Revert on failure
    } finally {
      setLoading(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setLoading('new')
    try {
      await fetch('/api/habits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, frequency: 'daily' })
      })
      setNewTitle('')
      setIsAdding(false)
      mutate()
    } catch (error) {
      console.error('Failed to create habit', error)
    } finally {
      setLoading(null)
    }
  }

  const { mutate: mutateGlobalAnalytics } = useSWRConfig()

  const handleDelete = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit and all its history?')) return
    
    setLoading(habitId)
    const previousHabits = habits
    
    // Optimistic UI update
    if (habits) {
      mutate(habits.filter(h => h.id !== habitId), false)
    }

    try {
      await fetch(`/api/habits/delete?habitId=${habitId}`, { method: 'DELETE' })
      mutate() // Re-fetch local habits
      mutateGlobalAnalytics('/api/habits/analytics?days=180') // Re-fetch global heatmap
    } catch (error) {
      console.error('Failed to delete habit', error)
      mutate(previousHabits)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Habits</h1>
          <p className="text-sm text-slate-400">Build consistency, one day at a time.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          New Habit
        </button>
      </div>

      <HabitAnalytics />

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            onSubmit={handleCreate}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="e.g. Read 10 pages, Meditate, Drink water..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                autoFocus
                disabled={loading === 'new'}
              />
              <button 
                type="submit" 
                className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50"
                disabled={loading === 'new' || !newTitle.trim()}
              >
                {loading === 'new' ? 'Saving...' : 'Save Habit'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!habits ? (
           <div className="col-span-full flex justify-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : habits.map((habit) => {
          const hasLoggedToday = habit.logs.some(l => l.date.split('T')[0] === todayStr)
          
          return (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 relative"
              style={{
                borderColor: hasLoggedToday ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                background: hasLoggedToday ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <button
                onClick={() => handleDelete(habit.id)}
                className="absolute top-4 right-4 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Habit"
              >
                <Trash2 size={16} />
              </button>

              <div className="flex items-center gap-4 pr-6">
                <button
                  onClick={() => handleToggle(habit.id)}
                  disabled={loading === habit.id}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-xl ${
                    hasLoggedToday 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-none' 
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400'
                  }`}
                >
                  {loading === habit.id ? (
                    <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} />
                  ) : hasLoggedToday ? (
                    <Check size={28} strokeWidth={3} />
                  ) : (
                    <span className="text-2xl">{habit.icon}</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold truncate transition-colors duration-300 ${hasLoggedToday ? 'text-emerald-400' : 'text-white'}`}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <HabitStreak habitId={habit.id} />
                  </div>
                </div>
              </div>

              {/* History View (Last 7 Days) */}
              <div className="mt-2 pt-4 border-t border-white/5">
                 <div className="flex justify-between items-center text-xs text-white/40 mb-2">
                   <span>Last 7 Days</span>
                 </div>
                 <div className="flex gap-2 justify-between">
                   {Array.from({ length: 7 }).map((_, i) => {
                     const d = new Date()
                     d.setDate(d.getDate() - (6 - i))
                     const dStr = d.toISOString().split('T')[0]
                     const isCompleted = habit.logs.some(l => l.date.split('T')[0] === dStr)
                     const isToday = dStr === todayStr

                     return (
                       <div key={i} className="flex flex-col items-center gap-1">
                         <div 
                           className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                             isCompleted ? 'bg-emerald-500/80' : 'bg-white/5 border border-white/10'
                           } ${isToday && !isCompleted ? 'border-emerald-500/30 border-2' : ''}`}
                         />
                         <span className="text-[10px] text-white/30">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                       </div>
                     )
                   })}
                 </div>
              </div>
            </motion.div>
          )
        })}

        {habits?.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center bg-white/5 border border-white/10 border-dashed rounded-2xl">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="text-emerald-500/50" size={32} />
            </div>
            <h3 className="text-xl text-white font-medium mb-2">No habits yet</h3>
            <p className="text-slate-400 mb-6">Start tracking your daily routines and build a streak.</p>
            <button onClick={() => setIsAdding(true)} className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create First Habit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function HabitStreak({ habitId }: { habitId: string }) {
  const { data } = useSWR<{ streak: number }>(`/api/habits/streak/${habitId}`, fetcher)
  
  if (!data) return <div className="animate-pulse bg-white/5 h-4 w-20 rounded" />
  
  const isActive = data.streak > 0

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${isActive ? 'text-amber-500' : 'text-slate-500'}`}>
      <Flame size={14} className={isActive ? 'fill-amber-500/20' : ''} />
      {data.streak} day streak
    </div>
  )
}
