import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventPlayerResponse } from '@/models'

export const handler: Handler = Api('DELETE', 'event-players-remove/:id', ([id]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventPlayerResponse>('event-players')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})
