import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { SeasonResponse, UserAuthResponse, UserResponse } from '@/models/api'

export const handler: Handler = Api('POST', '/users-attempt-login', (__, body) => async () => {
  if (!isValidRequest<{ password: string }>(body, [['password', 'string']])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('users')

    const users = await collection.aggregate([
      {
        $match: { password: body.password },
      },
      {
        $lookup: {
          from: 'seasons',
          localField: 'courseIds',
          foreignField: 'courseId',
          as: 'seasons',
        },
      },
      { $project: { courseIds: 0, password: 0 } },
    ]).toArray()

    const userAccount = getFirst(users) ?? await checkReadonlyPassword(body.password, db)

    return {
      statusCode: 200,
      body: JSON.stringify(userAccount),
    }
  } finally {
    await client.close()
  }
})

async function checkReadonlyPassword(password: string, db: Db): Promise<UserAuthResponse | null> {
  const collection = db.collection<SeasonResponse>('seasons')
  const season = await collection.findOne({ password })

  if (!season) {
    return null
  }

  return {
    _id: new ObjectId(),
    seasons: [season],
  }
}

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array

  return first
}