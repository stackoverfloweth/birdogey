import { Handler } from '@netlify/functions'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { UserResponse } from '@/models/api'

export const handler: Handler = Api('POST', '/courses-attempt-login', (__, body) => async () => {
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
          from: 'courses',
          localField: 'courseIds',
          foreignField: '_id',
          as: 'courses',
        },
      },
      { $project: { courses: 1 } },
    ]).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(getFirst(users)?.courses ?? []),
    }
  } finally {
    await client.close()
  }
})

function getFirst<T>(array: T[]): T | undefined {
  const [first] = array

  return first
}