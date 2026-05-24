'use server'

import { requireUser } from '@/lib/auth/user'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const user = await requireUser()

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return projects
}

export async function createProject(title: string, description?: string) {
  const user = await requireUser()

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title,
      description,
      status: 'active',
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  return project
}

export async function updateProjectStatus(projectId: string, status: 'active' | 'done' | 'paused') {
  const user = await requireUser()

  // Verify ownership
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: user.id },
  })

  if (!project) throw new Error('Project not found or unauthorized')

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: { status },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  return updatedProject
}

export async function deleteProject(projectId: string) {
  const user = await requireUser()

  // Verify ownership
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId: user.id },
  })

  if (!project) throw new Error('Project not found or unauthorized')

  await prisma.project.delete({
    where: { id: projectId },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
}
