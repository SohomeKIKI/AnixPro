'use client'

import { signOut } from '@/lib/auth/actions'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  return (
    <form
      action={async () => {
        setLoading(true)
        await signOut()
      }}
    >
      <button
        type="submit"
        id="logout-btn"
        disabled={loading}
        className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut size={15} strokeWidth={2} />
        {loading ? 'Signing out…' : 'Sign out'}
      </button>
    </form>
  )
}
