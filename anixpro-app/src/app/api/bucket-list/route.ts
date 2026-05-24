import { NextResponse } from 'next/server'
import { getBucketList, createBucketListItem } from '@/app/actions/bucket-list'

export async function GET() {
  try {
    const items = await getBucketList()
    return NextResponse.json(items)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { goal, taskId } = body

    if (!goal) {
      return NextResponse.json({ error: 'Goal is required' }, { status: 400 })
    }

    const item = await createBucketListItem(goal, taskId)
    return NextResponse.json(item, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
