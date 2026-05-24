import { NextResponse } from 'next/server'
import { deleteHabit } from '@/app/actions/habits'

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')
    
    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 })
    }

    await deleteHabit(habitId)
    
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Habit not found or unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
