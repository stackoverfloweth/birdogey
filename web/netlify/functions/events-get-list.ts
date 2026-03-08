import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventResponse } from '@/models/api'
import { checkSeasonAccess } from '../utilities/seasonAccess'

export const handler: Handler = Api('GET', '/events-get-list/:seasonId', ([seasonId], _, token) => async () => {
  checkSeasonAccess(seasonId, token)

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('events')

    const events = await collection.find({
      seasonId: new ObjectId(seasonId),
    })
      .sort({ created: -1 })
      .toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    }
  } finally {
    await client.close()
  }
})
