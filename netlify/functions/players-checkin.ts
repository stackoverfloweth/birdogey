import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventResponse, PlayerCheckInRequest, PlayerResponse } from '@/models'

export const handler: Handler = Api<PlayerCheckInRequest>('PUT', 'players-checkin/:id', ([id], body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const players = db.collection<PlayerResponse>('players')
    const events = db.collection<EventResponse>('events')

    // eslint-disable-next-line no-unused-vars
    const { eventId, tagId, udiscId } = body

    const result = await players.updateOne({ _id: new ObjectId(id) }, { $set: { tagId, udiscId } })
    const event = await events.findOne({ _id: new ObjectId(eventId) })

    if (event?.players.some(player => player.playerId.toString() === id)) {
      return { statusCode: 400 }
    }

    await events.updateOne({ _id: new ObjectId(eventId) }, {
      $push: {
        players: {
          _id: new ObjectId(),
          playerId: new ObjectId(id),
          incomingTagId: tagId,
          inForCtp: false,
          inForAce: false,
        },
      },
    })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
