'use server'

import { requireUser } from '@/lib/auth/user'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTasks() {
  const user = await requireUser()

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      project: true,
    },
  })

  return tasks
}

export async function createTask(
  title: string,
  projectId?: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  deadline?: Date,
  time?: string | null,
  place?: string | null,
  person?: string | null,
) {
  const user = await requireUser()

  // Optional: Verify project ownership if projectId is provided
  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
    })
    if (!project) throw new Error('Project not found or unauthorized')
  }

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title,
      projectId: projectId || null,
      priority,
      deadline,
      time: time || null,
      place: place || null,
      person: person || null,
      status: 'todo',
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/tasks')
  return task
}

export async function getTodayTasks() {
  const user = await requireUser()

  // Get start and end of today
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date()
  endOfDay.setHours(23, 59, 59, 999)

  const tasks = await prisma.task.findMany({
    where: { 
      userId: user.id,
      deadline: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    orderBy: { priority: 'desc' },
    include: {
      project: true,
    },
  })

  return tasks
}

export async function getTasksByProject(projectId: string) {
  const user = await requireUser()

  const tasks = await prisma.task.findMany({
    where: { 
      userId: user.id,
      projectId: projectId 
    },
    orderBy: { createdAt: 'desc' },
  })

  return tasks
}

export async function updateTask(taskId: string, data: {
  status?: 'todo' | 'in_progress' | 'done',
  title?: string,
  deadline?: Date | null,
  time?: string | null,
  place?: string | null,
  person?: string | null,
}) {
  const user = await requireUser()

  // Verify ownership
  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: user.id },
  })

  if (!task) throw new Error('Task not found or unauthorized')

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/tasks')
  return updatedTask
}

export async function deleteTask(taskId: string) {
  const user = await requireUser()

  // Verify ownership
  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: user.id },
  })

  if (!task) throw new Error('Task not found or unauthorized')

  await prisma.task.delete({
    where: { id: taskId },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/tasks')
}
