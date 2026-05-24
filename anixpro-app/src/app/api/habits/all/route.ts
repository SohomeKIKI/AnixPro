import { NextResponse } from 'next/server'
import { getHabits } from '@/app/actions/habits'

export async function GET() {
  try {
    const habits = await getHabits()
    return NextResponse.json(habits)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
