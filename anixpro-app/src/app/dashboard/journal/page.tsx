import { getJournals } from '@/app/actions/journal'
import JournalClient from './JournalClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — AnixPro',
  description: 'Your personal AI-powered journal.',
}

export default async function JournalPage() {
  // Server-side data fetching securely
  const journals = await getJournals()

  return <JournalClient initialEntries={journals} />
}
