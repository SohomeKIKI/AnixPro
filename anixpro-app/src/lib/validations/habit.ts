import { z } from 'zod'

export const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  frequency: z.enum(['daily', 'weekly']).optional().default('daily'),
  color: z.string().optional().default('#f59e0b'),
  icon: z.string().optional().default('⚡'),
})

export const toggleHabitLogSchema = z.object({
  habitId: z.string().uuid('Invalid habit ID'),
  date: z.string().datetime({ offset: true }), // Expects ISO string
})
