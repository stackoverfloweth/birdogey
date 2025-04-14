import { Handler } from '@netlify/functions'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { PlayerSignupRequest, PlayerResponse, SignupKeyResponse } from '@/models/api'
import { ObjectId } from 'mongodb'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag'

export const handler: Handler = Api('POST', 'players-signup', (args, body) => async () => {
  if (!isValidRequest<PlayerSignupRequest>(body, [
    ['key', 'string'],
    ['name', 'string'],
    ['imageUrl', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const keys = db.collection<SignupKeyResponse>('signup')
    const players = db.collection<PlayerResponse>('players')

    const signupKey = await keys.findOne({ _id: new ObjectId(body.key) })

    if (!signupKey) {
      return { statusCode: 404 }
    }

    const tagId = await getNextAvailableTag(signupKey.seasonId, players)
    const { name, imageUrl } = body

    const result = await players.insertOne({
      _id: new ObjectId(),
      seasonId: signupKey.seasonId,
      name,
      imageUrl,
      tagId,
      entryPaid: false,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})
