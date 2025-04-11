import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { PlayerRequest, PlayerResponse } from '@/models'
import { checkSeasonAccess } from '../utilities/seasonAccess'

export const handler: Handler = Api<Partial<PlayerRequest>>('PUT', 'players-update/:id', ([id], body, token) => async () => {
  if (!isValidRequest<PlayerRequest>(body, [
    ['seasonId', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  checkSeasonAccess(body.seasonId, token)

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<PlayerResponse>('players')

    const { seasonId, ...$set } = body

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
