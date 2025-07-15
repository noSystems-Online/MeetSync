import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { locationId, date, startTime, endTime, user, attendees } = await request.json()
    const client = await clientPromise
    const db = client.db('meeting-app')
    const collection = db.collection('meetings')

    // Check if the time slot is already booked
    const existingMeeting = await collection.findOne({
      locationId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    })
    if (existingMeeting) {
      return NextResponse.json({ error: 'Time slot already booked for this location' }, { status: 409 })
    }

    // Check for attendee conflicts
    if (attendees && attendees.length > 0) {
      const conflictingMeetings = await collection.find({
        date,
        attendees: { $in: attendees },
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
      }).toArray()

      if (conflictingMeetings.length > 0) {
        const conflictingAttendees = conflictingMeetings.flatMap(meeting => meeting.attendees)
        const conflictingAttendeeEmails = attendees.filter(attendee => conflictingAttendees.includes(attendee))
        return NextResponse.json({ error: `The following attendees are already booked at this time: ${conflictingAttendeeEmails.join(', ')}` }, { status: 409 })
      }
    }

    await collection.insertOne({ locationId, date, startTime, endTime, user, attendees })
    return NextResponse.json({ message: 'Meeting scheduled successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to schedule meeting' }, { status: 500 })
  }
}
