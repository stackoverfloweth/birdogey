import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { CourseResponse } from '@/models/api'

export const handler: Handler = Api('GET', '/courses-get-by-id/:courseId', ([courseId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<CourseResponse>('courses')

    const course = await collection.findOne({ _id: new ObjectId(courseId) })

    return {
      statusCode: 200,
      body: JSON.stringify(course),
    }
  } finally {
    await client.close()
  }
})