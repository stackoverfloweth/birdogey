import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api } from '../utilities/api'
import { env } from '../utilities/env'
import { getClient } from '../utilities/mongodbClient'
import { SeasonResponse } from '@/models/api'

export const handler: Handler = Api('GET', '/seasons-get-by-id/:seasonId', ([seasonId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<SeasonResponse>('seasons')

    const season = await collection.findOne({ _id: new ObjectId(seasonId) })

    return {
      statusCode: 200,
      body: JSON.stringify(season),
    }
  } finally {
    await client.close()
  }
})