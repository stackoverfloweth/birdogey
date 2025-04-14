import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { PlayerRequest, PlayerResponse } from '@/models'
import { checkSeasonAccess } from '../utilities/seasonAccess'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag'

export const handler: Handler = Api('POST', 'players-create', (args, body, token) => async () => {
  if (!isValidRequest<PlayerRequest>(body, [
    ['seasonId', 'string'],
    ['name', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  checkSeasonAccess(body.seasonId, token)

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<PlayerResponse>('players')
    const seasonId = new ObjectId(body.seasonId)

    const tagId = body.tagId ?? await getNextAvailableTag(seasonId, collection)

    const result = await collection.insertOne({
      _id: new ObjectId(),
      seasonId,
      name: body.name,
      entryPaid: body.entryPaid ?? false,
      tagId,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})
