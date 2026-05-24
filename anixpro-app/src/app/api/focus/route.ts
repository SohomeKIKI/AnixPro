import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const duration = body.duration

    if (!duration) {
      return NextResponse.json({ error: 'Duration is required' }, { status: 400 })
    }

    const focusSession = await prisma.focusSession.create({
      data: {
        userId: user.id,
        duration: typeof duration === 'string' ? parseInt(duration, 10) : duration
      }
    })

    return NextResponse.json(focusSession)
  } catch (error) {
    console.error('Error saving focus session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
