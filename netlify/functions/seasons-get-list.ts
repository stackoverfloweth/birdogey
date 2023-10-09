import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { SeasonResponse } from '@/models/api'

export const handler: Handler = Api('GET', '/seasons-get-list/:courseId', ([courseId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<SeasonResponse>('seasons')

    const seasons = await collection.find({
      courseId: new ObjectId(courseId),
    }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(seasons),
    }
  } finally {
    await client.close()
  }
})