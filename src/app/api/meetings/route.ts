import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { locationId, date, time, user } = await request.json()
    const client = await clientPromise
    const db = client.db('meeting-app')
    const collection = db.collection('meetings')

    // Check if the time slot is already booked
    const existingMeeting = await collection.findOne({ locationId, date, time })
    if (existingMeeting) {
      return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 })
    }

    await collection.insertOne({ locationId, date, time, user })
    return NextResponse.json({ message: 'Meeting scheduled successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule meeting' }, { status: 500 })
  }
}
