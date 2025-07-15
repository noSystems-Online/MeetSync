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
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [attendees, setAttendees] = useState('')

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
    if (!startTime || !endTime) {
      alert('Please select a start and end time')
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
        startTime,
        endTime,
        user: session.user,
        attendees: attendees.split(',').map(email => email.trim()),
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
    <main className="container mx-auto p-8">
      <div className="card">
        <h1 className="text-4xl font-bold text-white">Schedule a Meeting at {location.name}</h1>
        <form onSubmit={handleScheduleMeeting} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="date" className="text-white">Date</label>
              <input
                type="date"
                id="date"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="input mt-2"
              />
            </div>
            <div>
              <label htmlFor="startTime" className="text-white">Start Time</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input mt-2"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="text-white">End Time</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input mt-2"
              />
            </div>
            <div>
              <label htmlFor="attendees" className="text-white">Attendees (comma-separated emails)</label>
              <input
                type="text"
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="input mt-2"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-8">
            Schedule Meeting
          </button>
        </form>
      </div>
    </main>
  )
}
