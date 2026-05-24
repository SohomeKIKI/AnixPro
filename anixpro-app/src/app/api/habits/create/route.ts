import { NextResponse } from 'next/server'
import { createHabit } from '@/app/actions/habits'
import { createHabitSchema } from '@/lib/validations/habit'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createHabitSchema.parse(body)

    const habit = await createHabit(
      validatedData.title,
      validatedData.frequency,
      validatedData.color,
      validatedData.icon
    )
    
    return NextResponse.json(habit, { status: 201 })
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
