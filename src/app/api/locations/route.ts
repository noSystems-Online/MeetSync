import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const client = await clientPromise
    const db = client.db('meeting-app')
    const collection = db.collection('locations')
    await collection.insertOne({ name })
    return NextResponse.json({ message: 'Location created successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create location' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('meeting-app')
    const collection = db.collection('locations')
    const locations = await collection.find({}).toArray()
    return NextResponse.json(locations)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
  }
}
