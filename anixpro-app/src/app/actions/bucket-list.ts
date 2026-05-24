'use server'

import { requireUser } from '@/lib/auth/user'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getBucketList() {
  const user = await requireUser()

  const items = await prisma.bucketList.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      task: true,
    },
  })

  return items
}

export async function createBucketListItem(goal: string, taskId?: string) {
  const user = await requireUser()

  if (taskId) {
    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: user.id },
    })
    if (!task) throw new Error('Task not found or unauthorized')
  }

  const item = await prisma.bucketList.create({
    data: {
      userId: user.id,
      goal,
      status: 'pending',
      taskId: taskId || null,
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/bucket-list')
  return item
}

export async function updateBucketListItem(id: string, status: 'pending' | 'in_progress' | 'done') {
  const user = await requireUser()

  const item = await prisma.bucketList.findUnique({
    where: { id, userId: user.id },
  })

  if (!item) throw new Error('Bucket list item not found or unauthorized')

  const updatedItem = await prisma.bucketList.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/bucket-list')
  return updatedItem
}

export async function deleteBucketListItem(id: string) {
  const user = await requireUser()

  const item = await prisma.bucketList.findUnique({
    where: { id, userId: user.id },
  })

  if (!item) throw new Error('Bucket list item not found or unauthorized')

  await prisma.bucketList.delete({
    where: { id },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/bucket-list')
}
