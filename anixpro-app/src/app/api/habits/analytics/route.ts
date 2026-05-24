import { NextResponse } from 'next/server'
import { getGlobalHabitHistory } from '@/app/actions/habits'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '180', 10)
    
    const history = await getGlobalHabitHistory(days)
    
    return NextResponse.json(history)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 })
  }
}
