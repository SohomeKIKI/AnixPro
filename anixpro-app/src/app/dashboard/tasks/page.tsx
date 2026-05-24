import { Metadata } from 'next'
import TasksClient from './TasksClient'

export const metadata: Metadata = {
  title: 'Tasks | AnixPro AI',
  description: 'Manage your daily tasks and priorities.',
}

export default function TasksPage() {
  return <TasksClient />
}
