'use client'

import useSWR from 'swr'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Calendar as CalendarIcon, Target } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface GlobalLog {
  date: string
  habitId: string
}

export default function HabitAnalytics() {
  const { data: logs } = useSWR<GlobalLog[]>('/api/habits/analytics?days=180', fetcher)

  if (!logs) {
    return (
      <div className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl animate-pulse mb-8" />
    )
  }

  // Calculate stats
  const totalLogs = logs.length
  
  // Aggregate logs by date string (YYYY-MM-DD)
  const logCountsByDate: Record<string, number> = {}
  logs.forEach(log => {
    const dStr = log.date.split('T')[0]
    logCountsByDate[dStr] = (logCountsByDate[dStr] || 0) + 1
  })

  // Find max count for color scaling
  const maxCount = Math.max(...Object.values(logCountsByDate), 1)
  const activeDaysCount = Object.keys(logCountsByDate).length

  // Generate 2D Grid (GitHub/LeetCode style)
  const today = new Date()
  const startDate = new Date(today)
  startDate.setUTCDate(today.getUTCDate() - 180)
  startDate.setUTCDate(startDate.getUTCDay())

  const weeks: { date: string; count: number; isFuture: boolean }[][] = []
  let currentWeek: { date: string; count: number; isFuture: boolean }[] = []
  const currentDate = new Date(startDate)

  while (true) {
    if (currentDate > today && currentWeek.length === 0) {
      break
    }
    
    if (currentDate > today) {
      currentWeek.push({ date: '', count: 0, isFuture: true })
    } else {
      const dStr = currentDate.toISOString().split('T')[0]
      currentWeek.push({
        date: dStr,
        count: logCountsByDate[dStr] || 0,
        isFuture: false
      })
    }
    
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  // Group weeks by month for LeetCode style grid
  const months: { label: string, weeks: typeof weeks }[] = []
  let currentMonthWeeks: typeof weeks = []
  let currentMonthLabel = ''

  weeks.forEach(week => {
    // Find the first valid date in the week to determine the month
    const validDay = week.find(d => !d.isFuture) || week[0]
    
    // Fallback if all days are future
    let monthName = ''
    if (validDay && validDay.date) {
      const d = new Date(validDay.date)
      monthName = d.toLocaleDateString('en-US', { month: 'short' })
    } else {
      monthName = new Date().toLocaleDateString('en-US', { month: 'short' })
    }

    if (monthName !== currentMonthLabel) {
      if (currentMonthWeeks.length > 0) {
        months.push({ label: currentMonthLabel, weeks: currentMonthWeeks })
      }
      currentMonthLabel = monthName
      currentMonthWeeks = [week]
    } else {
      currentMonthWeeks.push(week)
    }
  })
  if (currentMonthWeeks.length > 0) {
    months.push({ label: currentMonthLabel, weeks: currentMonthWeeks })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Activity className="text-emerald-500 w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Activity Heatmap</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-2">
            <Target className="w-3 h-3" /> Total Actions
          </div>
          <div className="text-2xl font-bold text-white">{totalLogs}</div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-2">
            <CalendarIcon className="w-3 h-3" /> Active Days
          </div>
          <div className="text-2xl font-bold text-white">{activeDaysCount} <span className="text-sm font-normal text-white/30">/ 180</span></div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-2">
            <Activity className="w-3 h-3" /> Best Day
          </div>
          <div className="text-2xl font-bold text-white">{maxCount} <span className="text-sm font-normal text-white/30">habits</span></div>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-4">
          <div className="text-white/50 text-xs font-medium mb-1 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Consistency
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {Math.round((activeDaysCount / 180) * 100)}%
          </div>
        </div>
      </div>

      {/* GitHub/Leetcode Style Heatmap Grid grouped by Month */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-4 min-w-max">
          {months.map((monthBlock, mIdx) => (
            <div key={mIdx} className="flex flex-col gap-2">
              <div className="flex gap-1">
                {monthBlock.weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {week.map((day, j) => {
                      if (day.isFuture) {
                        return <div key={j} className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-transparent" />
                      }

                      let bgClass = 'bg-white/5 border border-white/5'
                      if (day.count > 0) {
                        const intensity = day.count / maxCount
                        if (intensity > 0.75) bgClass = 'bg-emerald-400'
                        else if (intensity > 0.5) bgClass = 'bg-emerald-500/80'
                        else if (intensity > 0.25) bgClass = 'bg-emerald-500/60'
                        else bgClass = 'bg-emerald-500/30'
                      }

                      return (
                        <div
                          key={j}
                          title={`${day.date}: ${day.count} habits`}
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] transition-all hover:ring-2 ring-white/50 cursor-pointer ${bgClass}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400 text-center font-medium">{monthBlock.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400">
        <span>180 Days Ago</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-white/5 border border-white/5"></div>
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500/30"></div>
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500/60"></div>
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500/80"></div>
          <div className="w-3 h-3 rounded-[2px] bg-emerald-400"></div>
          <span>More</span>
        </div>
        <span>Today</span>
      </div>
    </motion.div>
  )
}
