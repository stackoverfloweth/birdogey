import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventResponse } from '@/models/api'

export const handler: Handler = Api('GET', '/events-get-by-id/:eventId', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('events')

    const event = await collection.findOne({ _id: new ObjectId(eventId) })

    return {
      statusCode: 200,
      body: JSON.stringify(event),
    }
  } finally {
    await client.close()
  }
})