import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { EventPlayerRequest, EventPlayerResponse } from '@/models'

export const handler: Handler = Api('POST', 'event-players-create', (args, body) => async () => {
  if (!isValidRequest<EventPlayerRequest>(body, [
    ['playerId', 'string'],
    ['eventId', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventPlayerResponse>('event-players')

    const result = await collection.insertOne({
      _id: new ObjectId(),
      playerId: body.playerId,
      eventId: body.eventId,
      inForCtp: body.inForCtp ?? false,
      inForAce: body.inForAce ?? false,
      score: body.score,
      incomingTagId: body.incomingTagId,
      outgoingTagId: body.outgoingTagId,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})