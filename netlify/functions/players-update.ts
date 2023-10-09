import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { PlayerRequest, PlayerResponse } from '@/models'

export const handler: Handler = Api<Partial<PlayerRequest>>('PUT', 'players-update/:id', ([id], body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<PlayerResponse>('players')

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: body })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
