import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  projectId: z.string().uuid('Invalid project ID').optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  deadline: z.string().optional().nullable(),
  time: z.string().max(10).optional().nullable(),
  place: z.string().max(255).optional().nullable(),
  person: z.string().max(255).optional().nullable(),
})

export const updateTaskSchema = z.object({
  taskId: z.string().uuid('Invalid task ID'),
  title: z.string().min(1, 'Title is required').max(255).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  deadline: z.string().optional().nullable(),
  time: z.string().max(10).optional().nullable(),
  place: z.string().max(255).optional().nullable(),
  person: z.string().max(255).optional().nullable(),
})
