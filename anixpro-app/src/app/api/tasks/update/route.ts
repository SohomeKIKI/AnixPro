import { NextResponse } from 'next/server'
import { updateTask } from '@/app/actions/tasks'
import { updateTaskSchema } from '@/lib/validations/task'
import { z } from 'zod'

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    const validatedData = updateTaskSchema.parse(body)

    const task = await updateTask(validatedData.taskId, {
      status: validatedData.status,
      title: validatedData.title,
      deadline: validatedData.deadline !== undefined ? (validatedData.deadline ? new Date(validatedData.deadline) : null) : undefined,
      time: validatedData.time,
      place: validatedData.place,
      person: validatedData.person,
    })
    
    return NextResponse.json(task)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Task not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
