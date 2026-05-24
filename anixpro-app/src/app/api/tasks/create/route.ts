import { NextResponse } from 'next/server'
import { createTask } from '@/app/actions/tasks'
import { createTaskSchema } from '@/lib/validations/task'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate with Zod
    const validatedData = createTaskSchema.parse(body)

    const task = await createTask(
      validatedData.title, 
      validatedData.projectId || undefined, 
      validatedData.priority, 
      validatedData.deadline ? new Date(validatedData.deadline) : undefined,
      validatedData.time,
      validatedData.place,
      validatedData.person,
    )
    
    return NextResponse.json(task, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
