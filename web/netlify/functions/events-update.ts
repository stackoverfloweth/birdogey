import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventRequest, EventResponse } from '@/models'

export const handler: Handler = Api<Partial<EventRequest>>('PUT', 'events-update/:id', ([id], body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('events')

    const players = body.players?.map((eventPlayer) => ({
      ...eventPlayer,
      _id: new ObjectId(),
      playerId: new ObjectId(eventPlayer.playerId),
      inForCtp: eventPlayer.inForCtp ?? false,
      inForAce: eventPlayer.inForAce ?? false,
    })) ?? []

    const ctpPlayerIds = body.ctpPlayerIds?.map((playerId) => new ObjectId(playerId)) ?? []
    const acePlayerIds = body.acePlayerIds?.map((playerId) => new ObjectId(playerId)) ?? []

    const result = await collection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        notes: body.notes,
        ctpStartingBalance: body.ctpStartingBalance,
        aceStartingBalance: body.aceStartingBalance,
        ctpPerPlayer: body.ctpPerPlayer,
        acePerPlayer: body.acePerPlayer,
        players,
        ctpPlayerIds,
        acePlayerIds,
      },
    })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
