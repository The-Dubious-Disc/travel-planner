'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  if (loading) {
    return <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-md" />
  }

  return (
    <button
      onClick={user ? handleSignOut : handleSignIn}
      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      {user ? 'Sign Out' : 'Sign In'}
    </button>
  )
}
