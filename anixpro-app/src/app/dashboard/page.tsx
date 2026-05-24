import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardOverview from '@/components/dashboard/DashboardOverview'

import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Dashboard — AnixPro',
  description: 'Your AI life dashboard overview.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Calculate start and end of today
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  
  const todayEnd = new Date()
  todayEnd.setUTCHours(23, 59, 59, 999)

  // Fetch tasks for today
  const todayTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      deadline: {
        gte: todayStart,
        lte: todayEnd,
      }
    },
    orderBy: {
      deadline: 'asc'
    }
  })

  const completedTasksToday = todayTasks.filter(t => t.status === 'done').length
  const totalTasksToday = todayTasks.length

  // Fetch habits and their logs for today
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: {
      logs: {
        where: {
          date: {
            gte: todayStart,
            lte: todayEnd,
          }
        }
      }
    }
  })

  const totalHabitsToday = habits.length
  const completedHabitsToday = habits.filter(h => h.logs.length > 0).length

  // Fetch recent notes
  const recentNotes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  })

  // Fetch today's focus sessions
  const focusSessions = await prisma.focusSession.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      }
    }
  })
  
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0)

  return (
    <DashboardOverview 
      todayTasks={todayTasks}
      completedTasks={completedTasksToday}
      totalTasks={totalTasksToday}
      completedHabits={completedHabitsToday}
      totalHabits={totalHabitsToday}
      habits={habits}
      recentNotes={recentNotes}
      totalFocusMinutes={totalFocusMinutes}
    />
  )
}
