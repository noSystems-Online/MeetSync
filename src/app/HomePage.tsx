'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
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
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="absolute top-4 right-4">
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()} className="neumorphism-button ml-4">Sign out</button>
          <Link href="/admin" className="neumorphism-button ml-4">
            Admin
          </Link>
        </div>
        <h1 className="text-4xl font-bold">Schedule a Meeting</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location._id} className="neumorphism-container p-4">
              <h2 className="text-2xl font-bold">{location.name}</h2>
              <Link href={`/schedule/${location._id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                Schedule
              </Link>
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="neumorphism-container p-8 text-center">
        <h1 className="text-4xl font-bold">Meeting Scheduler</h1>
        <p className="mt-4">Please sign in to schedule a meeting</p>
        <form onSubmit={handleSignIn} className="mt-8 flex flex-col items-center">
          <input
            type="text"
            placeholder="Username (admin)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="neumorphism-input"
          />
          <input
            type="password"
            placeholder="Password (admin)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neumorphism-input mt-4"
          />
          <button type="submit" className="neumorphism-button mt-8">
            Sign In
          </button>
        </form>
        <button onClick={() => signIn('google')} className="neumorphism-button mt-8">
          Sign in with Google
        </button>
      </div>
    </main>
  )
}
