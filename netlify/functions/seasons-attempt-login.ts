import { Handler } from '@netlify/functions'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { SeasonResponse } from '@/models/api'

export const handler: Handler = Api('POST', '/seasons-attempt-login', (__, body) => async () => {
  if (!isValidRequest<{ password: string }>(body, [['password', 'string']])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<SeasonResponse>('seasons')

    const course = await collection.findOne({
      password: body.password,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(course),
    }
  } finally {
    await client.close()
  }
})