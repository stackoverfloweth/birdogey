import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { PlayerResponse } from '@/models/api'

export const handler: Handler = Api('GET', '/players-get-by-id/:playerId', ([playerId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<PlayerResponse>('players')

    const player = await collection.findOne({ _id: new ObjectId(playerId) })

    return {
      statusCode: 200,
      body: JSON.stringify(player),
    }
  } finally {
    await client.close()
  }
})