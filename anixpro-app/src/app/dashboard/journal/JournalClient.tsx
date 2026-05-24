'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Smile, Frown, Meh, Sparkles } from 'lucide-react'
import { createJournalEntry } from '@/app/actions/journal'
import type { Journal } from '@prisma/client'

interface JournalClientProps {
  initialEntries: Journal[]
}

const MOODS = [
  { id: 'happy', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { id: 'neutral', icon: Meh, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { id: 'sad', icon: Frown, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
]

export default function JournalClient({ initialEntries }: JournalClientProps) {
  const [entries, setEntries] = useState<Journal[]>(initialEntries)
  const [isWriting, setIsWriting] = useState(false)
  const [content, setContent] = useState('')
  const [selectedMood, setSelectedMood] = useState('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const newEntry = await createJournalEntry(content, selectedMood)
      // Add to front of list
      setEntries((prev) => [newEntry, ...prev])
      setContent('')
      setSelectedMood('neutral')
      setIsWriting(false)
    } catch (error) {
      console.error('Failed to save journal', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Formatting helper
  const formatDate = (dateValue: Date | string) => {
    const d = new Date(dateValue)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(d)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Journal</h1>
          <p className="text-sm text-slate-400">Capture your thoughts and AI will find the insights.</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="btn-primary"
          >
            <PenLine size={18} />
            Write Entry
          </button>
        )}
      </div>

      <AnimatePresence>
        {isWriting && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 mb-8 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)] relative overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-slate-400">How are you feeling?</span>
              <div className="flex items-center gap-2">
                {MOODS.map((m) => {
                  const Icon = m.icon
                  const isActive = selectedMood === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                        isActive ? `${m.bg} ${m.color} ${m.border}` : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                  )
                })}
              </div>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today? Write as much or as little as you want..."
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 min-h-[150px] resize-y mb-4 text-sm leading-relaxed"
              autoFocus
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {entries.map((entry) => {
          const moodConfig = MOODS.find(m => m.id === entry.mood) || MOODS[1]
          const MoodIcon = moodConfig.icon

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between mb-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${moodConfig.bg} ${moodConfig.color} ${moodConfig.border}`}>
                    <MoodIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Daily Reflection</p>
                    <p className="text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
                  </div>
                </div>

                {/* AI Summary Badge (Mock for now, ready for Sprint 5) */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                  <Sparkles size={14} />
                  AI Sync
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          )
        })}

        {entries.length === 0 && !isWriting && (
          <div className="py-16 text-center glass-card border-dashed">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <PenLine className="text-slate-400" size={24} />
            </div>
            <h3 className="text-white font-medium mb-1">Your journal is empty</h3>
            <p className="text-sm text-slate-400 mb-4">Start capturing your thoughts. AI will help you find patterns later.</p>
            <button onClick={() => setIsWriting(true)} className="btn-primary">
              Write First Entry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
