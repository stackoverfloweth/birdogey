import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { PlayerResponse } from '@/models'

export const handler: Handler = Api('POST', 'players-create', (args, body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<PlayerResponse>('players')

    const result = await collection.insertOne({
      _id: new ObjectId(),
      seasonId: body.seasonId,
      name: body.name,
      entryPaid: body.entryPaid,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is { name: string, seasonId: string, entryPaid?: boolean } {
  return !!value && typeof value === 'object'
    && 'name' in value && typeof value.name === 'string'
    && 'seasonId' in value && typeof value.seasonId === 'string'
}