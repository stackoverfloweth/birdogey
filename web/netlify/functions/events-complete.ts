import { Handler } from '@netlify/functions'
import { BulkWriteResult, Db, ObjectId } from 'mongodb'
import { Api, env, getClient } from '../utilities'
import { EventPlayerResponse, EventRequest, EventResponse, PlayerResponse } from '@/models'

export const handler: Handler = Api<Partial<EventRequest>>('PUT', 'events-complete/:id', ([id], body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('events')

    const requestPlayers = body.players ?? []
    const availableTags = requestPlayers.map(({ incomingTagId }) => incomingTagId).sort((aTag, bTag) => aTag - bTag)
    const sortedByScore = requestPlayers.sort((aPlayer, bPlayer) => (aPlayer.score ?? Infinity) - (bPlayer.score ?? Infinity) || aPlayer.incomingTagId - bPlayer.incomingTagId)

    const players = requestPlayers.map(eventPlayer => ({
      ...eventPlayer,
      _id: new ObjectId(),
      playerId: new ObjectId(eventPlayer.playerId),
      inForCtp: eventPlayer.inForCtp ?? false,
      inForAce: eventPlayer.inForAce ?? false,
      outgoingTagId: availableTags[sortedByScore.findIndex(({ playerId }) => playerId === eventPlayer.playerId)],
    }))

    const ctpPlayerIds = body.ctpPlayerIds?.map(playerId => new ObjectId(playerId)) ?? []
    const acePlayerIds = body.acePlayerIds?.map(playerId => new ObjectId(playerId)) ?? []

    const result = await collection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        completed: new Date(),
        notes: body.notes,
        players,
        ctpPlayerIds,
        acePlayerIds,
      },
    })

    await updatePlayerTags(db, players)

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})

function updatePlayerTags(db: Db, players: EventPlayerResponse[]): Promise<BulkWriteResult> {
  const playerUpdates: Partial<PlayerResponse>[] = players.map(player => ({
    _id: new ObjectId(player.playerId),
    tagId: player.outgoingTagId,
  }))

  const collection = db.collection<PlayerResponse>('players')

  return collection.bulkWrite(playerUpdates.map(({ _id, tagId }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: { tagId } },
    },
  })))
}
