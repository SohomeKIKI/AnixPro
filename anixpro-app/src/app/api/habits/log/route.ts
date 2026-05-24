import { NextResponse } from 'next/server'
import { toggleHabitLog } from '@/app/actions/habits'
import { toggleHabitLogSchema } from '@/lib/validations/habit'
import { z } from 'zod'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = toggleHabitLogSchema.parse(body)

    await toggleHabitLog(validatedData.habitId, new Date(validatedData.date))
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Habit not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')
    const dateStr = searchParams.get('date')

    if (!habitId || !dateStr) {
      return NextResponse.json({ error: 'habitId and date are required parameters' }, { status: 400 })
    }

    // Rely on the toggle function to remove it
    await toggleHabitLog(habitId, new Date(dateStr))
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Habit not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
