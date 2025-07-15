'use client'

import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function HomePage({ locations }) {
  const { data: session } = useSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()
    signIn('credentials', { username, password })
  }

  if (session) {
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-white">Schedule a Meeting</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location._id} className="card">
              <h2 className="text-2xl font-bold text-white">{location.name}</h2>
              <Link href={`/schedule/${location._id}`} className="btn btn-primary mt-4">
                Schedule
              </Link>
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="card text-center">
        <h1 className="text-4xl font-bold text-white">Meeting Scheduler</h1>
        <p className="mt-4 text-gray-400">Please sign in to schedule a meeting</p>
        <form onSubmit={handleSignIn} className="mt-8 flex flex-col items-center">
          <input
            type="text"
            placeholder="Username (admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password (admin)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-4"
          />
          <button type="submit" className="btn btn-primary mt-8">
            Sign In
          </button>
        </form>
        <button onClick={() => signIn('google')} className="btn btn-primary mt-4">
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
