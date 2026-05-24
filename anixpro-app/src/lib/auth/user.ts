import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Secures server components and actions by verifying the Supabase session
 * and returning the user ID. Redirects to /login if unauthenticated.
 * Use this in your Server Actions before executing Prisma queries.
 */
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}
