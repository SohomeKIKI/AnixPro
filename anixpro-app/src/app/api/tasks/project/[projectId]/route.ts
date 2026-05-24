import { NextResponse } from 'next/server'
import { getTasksByProject } from '@/app/actions/tasks'

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    const tasks = await getTasksByProject(params.projectId)
    return NextResponse.json(tasks)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
