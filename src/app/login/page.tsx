'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        setError(error.message)
        setLoading(false)
        return
    }

    if (data.session) {
        router.push('/')
        router.refresh()
    } else {
        // Fallback if auto-confirm is not enabled, though we assume it is.
        // If no session, we probably shouldn't redirect as they aren't logged in,
        // but the prompt implies a simplified flow.
        // We will just show a generic message if no session is immediately available
        // to avoid a broken redirect loop or confusing state.
        setError('Account created. Please sign in.') 
        setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex gap-2">
            <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Sign In'}
            </button>
            <button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
                Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
