'use client'

import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { CheckSquare, Activity, BookOpen, Zap, Play } from 'lucide-react'
import PomodoroTimer from './PomodoroTimer'

interface DashboardOverviewProps {
  todayTasks: Array<{ id: string; title: string; status: string; deadline: Date | null; time: string | null; priority?: string }>
  completedTasks: number
  totalTasks: number
  completedHabits: number
  totalHabits: number
  habits: Array<{ id: string; title: string; icon?: string; color: string; logs: Array<unknown> }>
  recentNotes: Array<{ id: string; title: string | null; summary: string | null; createdAt: Date }>
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function DashboardOverview({
  todayTasks,
  completedTasks,
  totalTasks,
  completedHabits,
  totalHabits,
  habits,
  recentNotes,
  totalFocusMinutes = 0,
}: DashboardOverviewProps & { totalFocusMinutes?: number }) {
  
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  const totalGoals = totalTasks + totalHabits
  const completedGoals = completedTasks + completedHabits
  
  // Basic attention score calculation based on habit + task completion percentage
  // Boost the score if they have focus minutes
  const baseScore = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
  const attentionScore = Math.min(100, Math.round(baseScore + (totalFocusMinutes / 5)))
  
  // Calculate deep work time from real focus sessions instead of fake math
  const deepWorkHours = Math.floor(totalFocusMinutes / 60)
  const deepWorkRemainder = totalFocusMinutes % 60

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto"
    >
      <PomodoroTimer isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />
      {/* Top Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">
            Your daily plan
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">
            Stay on Track Today
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3 pr-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 shadow-inner">
              <CheckSquare size={18} className="text-white/80" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Keep it going!</p>
              <p className="text-[10px] text-slate-400">
                {totalTasks === 0 ? "No tasks for today." : completedTasks === totalTasks ? "You've done all today's tasks!" : `${totalTasks - completedTasks} tasks remaining today.`}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsTimerOpen(true)}
            className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 px-4 py-2.5 rounded-full text-xs font-medium transition-colors"
          >
            <Play size={14} className="fill-current" /> Focus Timer
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-full text-xs font-medium transition-colors border border-white/10">
            Customize
          </button>
        </div>
      </motion.div>

      {/* Date & Progress Row */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
            <span className="text-lg font-semibold text-white leading-none">{new Date().getDate()}</span>
            <span className="text-[10px] text-slate-400">{new Date().toLocaleDateString('en-US', { month: 'short' })}</span>
          </div>
          <p className="text-sm text-slate-400">
            Your Daily Goals <span className="text-white font-semibold">{completedGoals}/{totalGoals}</span> completed
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            &larr;
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            &rarr;
          </button>
        </div>
      </motion.div>

      {/* Three Major Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        
        {/* Deep Work Time */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between h-[200px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          {/* Spotlight Gradient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <p className="text-sm font-medium text-white/80">Deep Work Time</p>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
               <div className="w-2 h-2 flex gap-0.5">
                 <div className="w-0.5 h-full bg-white/80 rounded-full" />
                 <div className="w-0.5 h-full bg-white/80 rounded-full" />
               </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-light text-white tracking-tight">{deepWorkHours}h {deepWorkRemainder}m</h2>
          </div>
        </motion.div>

        {/* Attention Quality */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between h-[200px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          {/* Image/Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 to-orange-900/40" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-60 mix-blend-overlay" style={{ background: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop) center/cover' }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

          <div className="flex items-start justify-between relative z-10">
            <p className="text-sm font-medium text-white/80">Attention Quality</p>
          </div>
          
          <div className="flex items-end justify-between relative z-10">
            <h2 className="text-5xl font-light text-amber-400 tracking-tight">{attentionScore}%</h2>
            <p className="text-[10px] font-medium text-amber-400/80 mb-2">Last 60 min</p>
          </div>
        </motion.div>

        {/* Focus Stability */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-3xl p-6 overflow-hidden flex flex-col justify-between h-[200px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-start justify-between relative z-10 mb-4">
            <p className="text-sm font-medium text-white/80">Focus Stability</p>
            <div className="px-2 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/50">
              Current Score: <span className="text-white font-medium">64</span>
            </div>
          </div>
          
          <div className="relative z-10 flex-1 flex items-end justify-between gap-1.5 h-full pt-8">
            {/* Fake Glowing Bar Chart */}
            <div className="absolute top-10 left-0 px-2 py-1 rounded-full bg-white text-black text-[10px] font-bold shadow-[0_0_15px_rgba(255,255,255,0.5)] z-20">
              Peak: 11 am
            </div>
            
            <div className="absolute w-full border-b border-dashed border-white/20 bottom-8 z-0" />
            
            {[30, 45, 60, 40, 85, 35, 70, 45, 65, 30].map((val, i) => (
              <div key={i} className="w-full relative group h-full flex items-end justify-center">
                <div 
                  className="w-full max-w-[12px] rounded-full relative z-10 transition-all duration-300 group-hover:bg-white"
                  style={{ 
                    height: `${val}%`, 
                    background: i === 4 ? 'linear-gradient(180deg, #f59e0b 0%, rgba(245,158,11,0.2) 100%)' : 'rgba(255,255,255,0.15)',
                    boxShadow: i === 4 ? '0 0 20px rgba(245,158,11,0.5)' : 'none'
                  }} 
                />
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Daily Timeline */}
      <motion.div 
        variants={itemVariants}
        className="rounded-3xl p-6 relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-white">Daily Timeline</h3>
            <span className="text-white/20">|</span>
            <span className="text-xs text-slate-400">{totalTasks} Tasks for today</span>
          </div>
          <button className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4">
            Add an Event
          </button>
        </div>

        {/* Timeline Graph Container */}
        <div className="relative w-full h-[120px]">
           {/* Grid Lines */}
           <div className="absolute inset-0 flex justify-between">
             {['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'].map((time, i) => (
               <div key={i} className="flex flex-col items-center h-full relative">
                 <span className="text-[10px] text-slate-500 absolute -top-6 whitespace-nowrap">{time}</span>
                 <div className="w-[1px] h-full bg-white/5" />
               </div>
             ))}
           </div>

           {/* Task Pills */}
           {todayTasks.length === 0 ? (
             <div className="absolute inset-0 flex items-center justify-center">
               <p className="text-sm text-slate-500">No tasks scheduled for today. Take a break!</p>
             </div>
           ) : (
             todayTasks.map((task, idx) => {
               // Calculate position based on time
               let hour = 12 // default to noon
               if (task.time) {
                 const [h, m] = task.time.split(':')
                 hour = parseInt(h) + (parseInt(m) || 0) / 60
               } else if (task.deadline) {
                 const d = new Date(task.deadline)
                 hour = d.getHours() + d.getMinutes() / 60
               }
               
               // Timeline spans from 8 AM (8) to 8 PM (20) -> 12 hours total
               // Clamp hour between 8 and 20 for visual representation
               const clampedHour = Math.max(8, Math.min(19, hour))
               const leftPercent = ((clampedHour - 8) / 12) * 100
               // Standardize width to roughly 20% of timeline
               const rightPercent = Math.max(0, 100 - (leftPercent + 20))
               
               // Stagger vertical position to avoid overlap
               const tops = ['top-2', 'top-14', 'top-26', 'top-8']
               const topClass = tops[idx % tops.length]

               // Determine color based on priority
               let dotColor = 'bg-slate-400'
               let shadowColor = 'shadow-[0_0_8px_#94a3b8]'
               let textColor = 'text-slate-400'
               let label = 'Normal'
               
               if (task.priority === 'high') {
                 dotColor = 'bg-rose-500'
                 shadowColor = 'shadow-[0_0_8px_#f43f5e]'
                 textColor = 'text-rose-400'
                 label = 'High priority'
               } else if (task.priority === 'low') {
                 dotColor = 'bg-blue-500'
                 shadowColor = 'shadow-[0_0_8px_#3b82f6]'
                 textColor = 'text-blue-400'
                 label = 'Low priority'
               } else {
                 dotColor = 'bg-emerald-500'
                 shadowColor = 'shadow-[0_0_8px_#10b981]'
                 textColor = 'text-emerald-400'
                 label = 'Important'
               }

               return (
                 <div key={task.id} className={`absolute ${topClass}`} style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}>
                   <div className={`w-full ${task.status === 'done' ? 'bg-white/5 opacity-50' : 'bg-white/10 hover:bg-white/15'} border border-white/5 rounded-full px-4 py-2 flex items-center justify-between cursor-pointer transition-colors shadow-lg backdrop-blur-sm`}>
                     <div className="flex items-center gap-2 overflow-hidden mr-2">
                       <span className={`${textColor} text-xs shrink-0`}>{task.status === 'done' ? '✓' : '📝'}</span>
                       <span className={`text-xs font-medium text-white truncate ${task.status === 'done' ? 'line-through text-white/50' : ''}`}>{task.title}</span>
                     </div>
                     <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 shrink-0">
                       <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${shadowColor}`} />
                       <span className="text-[9px] text-slate-300">{label}</span>
                     </div>
                   </div>
                 </div>
               )
             })
           )}
        </div>

      </motion.div>

      {/* Lower Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        
        {/* Recent Notes & AI Insights */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 rounded-3xl p-6 relative overflow-hidden flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-white">Recent Notes</h3>
            </div>
            <button className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4">
              View All
            </button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {recentNotes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-6 bg-white/5">
                <BookOpen size={24} className="text-slate-500 mb-2" />
                <p className="text-sm text-slate-400">No notes yet.</p>
                <button className="mt-3 text-xs font-medium text-amber-500 hover:text-amber-400">Create your first note</button>
              </div>
            ) : (
              recentNotes.map(note => (
                <div key={note.id} className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex flex-col gap-2 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white truncate pr-4">{note.title || 'Untitled Note'}</h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  {note.summary ? (
                    <div className="flex items-start gap-2 mt-1">
                      <Zap size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{note.summary}</p>
                    </div>
                  ) : (
                     <p className="text-xs text-slate-500 italic">No AI summary available.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Daily Habits List */}
        <motion.div 
          variants={itemVariants}
          className="rounded-3xl p-6 relative overflow-hidden flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium text-white">Daily Habits</h3>
            </div>
            <button className="text-xs text-slate-300 hover:text-white underline decoration-slate-500 underline-offset-4">
              Manage
            </button>
          </div>
          
          <div className="flex flex-col gap-3 flex-1">
            {habits.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-6 bg-white/5">
                 <Activity size={24} className="text-slate-500 mb-2" />
                 <p className="text-sm text-slate-400 text-center">Start building better habits today.</p>
                 <button className="mt-3 text-xs font-medium text-amber-500 hover:text-amber-400">Add a Habit</button>
               </div>
            ) : (
               habits.map(habit => {
                 const isCompletedToday = habit.logs && habit.logs.length > 0;
                 return (
                   <div key={habit.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                     <div className="flex items-center gap-3">
                       <div 
                         className="w-8 h-8 rounded-xl flex items-center justify-center"
                         style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                       >
                         {habit.icon || '⚡'}
                       </div>
                       <span className={`text-sm font-medium ${isCompletedToday ? 'text-slate-500 line-through' : 'text-white'}`}>
                         {habit.title}
                       </span>
                     </div>
                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isCompletedToday ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                       {isCompletedToday && <CheckSquare size={12} className="text-white" />}
                     </div>
                   </div>
                 )
               })
            )}
          </div>
        </motion.div>

      </div>

    </motion.div>
  )
}
