'use server'

import { requireUser } from '@/lib/auth/user'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getJournals() {
  const user = await requireUser()

  const journals = await prisma.journal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20, // Paginate top 20 for now
  })

  return journals
}

export async function createJournalEntry(content: string, mood: string = 'neutral') {
  const user = await requireUser()

  const entry = await prisma.journal.create({
    data: {
      userId: user.id, // Strictly bound to logged-in user
      content,
      mood,
    },
  })

  // We will trigger AI summary generation asynchronously here in Sprint 5
  // For now, it just saves the entry.

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/journal')
  return entry
}
