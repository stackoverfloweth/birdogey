import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest, generateToken } from '../utilities'
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

    if (!userAccount) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      }
    }

    const user = {
      ...userAccount,
      isAuthorized: true,
      isAdmin: userAccount.isAdmin ?? false,
      isReadonly: userAccount.isReadonly ?? false,
      seasons: userAccount.seasons ?? [],
    }

    const token = generateToken(user)

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...user,
        token,
      }),
    }
  } finally {
    await client.close()
  }
}, { isPublic: true })

async function checkReadonlyPassword(password: string, db: Db): Promise<UserAuthResponse | null> {
  const collection = db.collection<SeasonResponse>('seasons')
  const season = await collection.findOne({ password })

  if (!season) {
    return null
  }

  return {
    _id: new ObjectId(),
    isAuthorized: true,
    isReadonly: true,
    seasons: [season],
  }
}

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array

  return first
}
