import { NextResponse } from 'next/server'
import { getHabitStreak } from '@/app/actions/habits'

export async function GET(request: Request, { params }: { params: { habitId: string } }) {
  try {
    const streak = await getHabitStreak(params.habitId)
    return NextResponse.json({ streak })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Habit not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
