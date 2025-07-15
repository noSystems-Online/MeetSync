'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SchedulePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/')
    },
  })

  const params = useParams()
  const { locationId } = params
  const [location, setLocation] = useState(null)
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('')

  useEffect(() => {
    if (!locationId) return
    const fetchLocation = async () => {
      const res = await fetch(`/api/locations/${locationId}`)
      const data = await res.json()
      setLocation(data)
    }
    fetchLocation()
  }, [locationId])

  const handleScheduleMeeting = async (e) => {
    e.preventDefault()
    if (!time) {
      alert('Please select a time')
      return
    }

    const res = await fetch('/api/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        date: date.toISOString().split('T')[0],
        time,
        user: session.user,
      }),
    })

    if (res.ok) {
      alert('Meeting scheduled successfully')
    } else {
      const data = await res.json()
      alert(data.error)
    }
  }

  if (!location) {
    return <div>Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="neumorphism-container p-8 text-center">
        <h1 className="text-4xl font-bold">Schedule a Meeting at {location.name}</h1>
        <form onSubmit={handleScheduleMeeting} className="mt-8">
          <div className="flex flex-col">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="neumorphism-input mt-2"
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="neumorphism-input mt-2"
            />
          </div>
          <button type="submit" className="neumorphism-button mt-8">
            Schedule Meeting
          </button>
        </form>
      </div>
    </main>
  )
}
