import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request, { params }: { params: { locationId: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('meeting-app')
    const collection = db.collection('locations')
    const location = await collection.findOne({ _id: new ObjectId(params.locationId) })
    return NextResponse.json(location)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 })
  }
}
