import { NextResponse } from 'next/server'
import { getHabitHistory } from '@/app/actions/habits'

export async function GET(request: Request, { params }: { params: { habitId: string } }) {
  try {
    const history = await getHabitHistory(params.habitId)
    return NextResponse.json(history)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Habit not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
