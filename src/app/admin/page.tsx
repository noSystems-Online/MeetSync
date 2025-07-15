'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/admin')
    },
  })

  const [locations, setLocations] = useState([])
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    const fetchLocations = async () => {
      const res = await fetch('/api/locations')
      const data = await res.json()
      setLocations(data)
    }
    fetchLocations()
  }, [])

  const handleAddLocation = async (e) => {
    e.preventDefault()
    if (!newLocation) return
    await fetch('/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newLocation }),
    })
    setNewLocation('')
    const res = await fetch('/api/locations')
    const data = await res.json()
    setLocations(data)
  }

  return (
    <main className="container mx-auto p-8">
      <div className="card">
        <h1 className="text-4xl font-bold text-white">Admin Page</h1>
        <p className="text-gray-400">Welcome, {session?.user?.email}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white">Locations</h2>
          <form onSubmit={handleAddLocation} className="mt-4 flex">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="input"
              placeholder="Add a new location"
            />
            <button
              type="submit"
              className="btn btn-primary ml-4"
            >
              Add
            </button>
          </form>
          <ul className="mt-4">
            {locations.map((location) => (
              <li key={location._id} className="card mt-2 p-2">
                {location.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
