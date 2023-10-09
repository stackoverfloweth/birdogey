import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { EventRequest, EventResponse } from '@/models'

export const handler: Handler = Api('POST', 'events-create', (args, body) => async () => {
  if (!isValidRequest<EventRequest>(body, [
    ['seasonId', 'string'],
    ['name', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('events')

    const players = body.players?.map(eventPlayer => ({
      ...eventPlayer,
      _id: new ObjectId(),
      playerId: new ObjectId(eventPlayer.playerId),
      inForCtp: eventPlayer.inForCtp ?? false,
      inForAce: eventPlayer.inForAce ?? false,
    })) ?? []

    const result = await collection.insertOne({
      _id: new ObjectId(),
      seasonId: new ObjectId(body.seasonId),
      created: new Date(),
      name: body.name,
      notes: body.notes,
      ctpStartingBalance: body.ctpStartingBalance ?? 0,
      aceStartingBalance: body.aceStartingBalance ?? 0,
      ctpPerPlayer: body.ctpPerPlayer,
      acePerPlayer: body.acePerPlayer,
      ctpPlayerIds: [],
      acePlayerIds: [],
      players,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})