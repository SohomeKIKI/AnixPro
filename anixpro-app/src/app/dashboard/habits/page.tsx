import HabitsClient from './HabitsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Habits — AnixPro',
  description: 'Track your daily habits and build streaks.',
}

export default function HabitsPage() {
  return <HabitsClient />
}
