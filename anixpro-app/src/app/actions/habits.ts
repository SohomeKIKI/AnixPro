'use server'

import { requireUser } from '@/lib/auth/user'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getHabits() {
  const user = await requireUser()

  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
    include: {
      logs: {
        // Fetch logs for the last 7 days for streak calculation
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      },
    },
  })

  return habits
}

export async function createHabit(title: string, frequency: string = 'daily', color: string = '#f59e0b', icon: string = '⚡') {
  const user = await requireUser()

  const habit = await prisma.habit.create({
    data: {
      userId: user.id, // Strictly bound to logged-in user
      title,
      frequency,
      color,
      icon,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
  return habit
}

export async function deleteHabit(habitId: string) {
  const user = await requireUser()

  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
  })

  if (!habit) throw new Error('Habit not found or unauthorized')

  await prisma.habit.delete({
    where: { id: habit.id },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
}

export async function toggleHabitLog(habitId: string, clientDate: Date) {
  const user = await requireUser()

  // Verify ownership
  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
  })

  if (!habit) throw new Error('Habit not found or unauthorized')

  // Strictly extract the YYYY-MM-DD part from the incoming date
  // This prevents timezone drift from shifting the day boundaries
  const isoString = clientDate.toISOString()
  const dateString = isoString.split('T')[0]
  const normalizedDate = new Date(`${dateString}T00:00:00.000Z`)

  const existingLog = await prisma.habitLog.findUnique({
    where: {
      habitId_date: {
        habitId: habit.id,
        date: normalizedDate,
      },
    },
  })

  if (existingLog) {
    await prisma.habitLog.delete({
      where: { id: existingLog.id },
    })
  } else {
    try {
      await prisma.habitLog.create({
        data: {
          userId: user.id,
          habitId: habit.id,
          date: normalizedDate,
          completed: true,
        },
      })
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && (error as { code: string }).code !== 'P2002') throw error
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/habits')
}

export async function getHabitHistory(habitId: string, days: number = 30) {
  const user = await requireUser()

  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
  })

  if (!habit) throw new Error('Habit not found or unauthorized')

  const startDate = new Date()
  startDate.setUTCDate(startDate.getUTCDate() - days)
  startDate.setUTCHours(0, 0, 0, 0)

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId,
      date: { gte: startDate },
    },
    orderBy: { date: 'desc' },
    select: { date: true, completed: true }
  })

  return logs
}

export async function getGlobalHabitHistory(days: number = 30) {
  const user = await requireUser()

  const startDate = new Date()
  startDate.setUTCDate(startDate.getUTCDate() - days)
  startDate.setUTCHours(0, 0, 0, 0)

  // Fetch all logs for this user in the last 'days'
  const logs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate },
      completed: true,
    },
    select: { date: true, habitId: true }
  })

  return logs
}

export async function getHabitStreak(habitId: string) {
  const user = await requireUser()

  // Validate ownership first
  const habit = await prisma.habit.findUnique({
    where: { id: habitId, userId: user.id },
    select: { id: true }
  })

  if (!habit) throw new Error('Habit not found or unauthorized')

  // Optimize query: only fetch 'date', preventing massive memory overhead
  const logs = await prisma.habitLog.findMany({
    where: { habitId, completed: true },
    orderBy: { date: 'desc' },
    select: { date: true },
  })

  if (logs.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  let currentDateToCheck = new Date(today)

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].date)
    logDate.setUTCHours(0, 0, 0, 0)

    if (logDate.getTime() === currentDateToCheck.getTime()) {
      streak++
      currentDateToCheck.setUTCDate(currentDateToCheck.getUTCDate() - 1)
    } else if (logDate.getTime() > currentDateToCheck.getTime()) {
      continue
    } else {
      if (streak === 0 && currentDateToCheck.getTime() === today.getTime()) {
        const yesterday = new Date(today)
        yesterday.setUTCDate(yesterday.getUTCDate() - 1)
        if (logDate.getTime() === yesterday.getTime()) {
          streak++
          currentDateToCheck = new Date(yesterday)
          currentDateToCheck.setUTCDate(currentDateToCheck.getUTCDate() - 1)
          continue
        }
      }
      break
    }
  }

  return streak
}
