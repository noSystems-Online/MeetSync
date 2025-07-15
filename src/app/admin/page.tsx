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
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Admin Page</h1>
      <p>Welcome, {session?.user?.email}</p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Locations</h2>
        <form onSubmit={handleAddLocation} className="mt-4 flex">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-l-md"
            placeholder="Add a new location"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-md"
          >
            Add
          </button>
        </form>
        <ul className="mt-4">
          {locations.map((location) => (
            <li key={location._id} className="border-b py-2">
              {location.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
