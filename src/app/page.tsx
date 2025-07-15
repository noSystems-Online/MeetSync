'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch('/api/locations')
      const data = await res.json()
      setLocations(data)
    }
    fetchLocations()
  }, [])

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="absolute top-4 right-4">
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()} className="ml-4 bg-red-500 text-white p-2 rounded-md">Sign out</button>
          <Link href="/admin">
            <a className="ml-4 bg-blue-500 text-white p-2 rounded-md">Admin</a>
          </Link>
        </div>
        <h1 className="text-4xl font-bold">Schedule a Meeting</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div key={location._id} className="border p-4 rounded-md">
              <h2 className="text-2xl font-bold">{location.name}</h2>
              <Link href={`/schedule/${location._id}`}>
                <a className="text-blue-500 hover:underline mt-2 inline-block">Schedule</a>
              </Link>
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Meeting Scheduler</h1>
      <p className="mt-4">Please sign in to schedule a meeting</p>
      <button onClick={() => signIn('google')} className="mt-8 bg-blue-500 text-white p-4 rounded-md">
        Sign in with Google
      </button>
    </main>
  )
}
