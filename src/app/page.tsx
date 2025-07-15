import clientPromise from '@/lib/mongodb'
import HomePage from './HomePage'

async function getLocations() {
  const client = await clientPromise
  const db = client.db('meeting-app')
  const collection = db.collection('locations')
  const locations = await collection.find({}).toArray()
  return locations
}

export default async function Home() {
  const locations = await getLocations()
  return <HomePage locations={JSON.parse(JSON.stringify(locations))} />
}
