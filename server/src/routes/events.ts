import { Hono } from 'hono'
import { BulkWriteResult, Db, ObjectId } from 'mongodb'
import { EventPlayerResponse, EventRequest, EventResponse, PlayerResponse } from '@/models/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { isValidRequest } from '../utilities/requestValidation.js'

const events = new Hono()

events.use(authMiddleware)

events.get('/', async (c) => {
  const seasonId = c.req.query('seasonId')

  if (!seasonId) {
    throw new HttpError(400, 'seasonId query parameter is required')
  }

  const token = getJwtPayload(c)
  checkSeasonAccess(seasonId, token)

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const result = await collection.find({
    seasonId: new ObjectId(seasonId),
  })
    .sort({ created: -1 })
    .toArray()

  return c.json(result)
})

events.get('/:id', async (c) => {
  const id = c.req.param('id')

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const event = await collection.findOne({ _id: new ObjectId(id) })

  return c.json(event)
})

events.post('/', async (c) => {
  const body = await c.req.json()
  const token = getJwtPayload(c)

  if (!isValidRequest<EventRequest>(body, [
    ['seasonId', 'string'],
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  checkSeasonAccess(body.seasonId, token)

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const players = body.players?.map((eventPlayer: any) => ({
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

  return c.json(result.insertedId, 201)
})

events.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json() as Partial<EventRequest>

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const players = body.players?.map((eventPlayer: any) => ({
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

  return c.json(null, result.acknowledged ? 202 : 400)
})

events.put('/:id/complete', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json() as Partial<EventRequest>

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
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

  return c.json(null, result.acknowledged ? 202 : 400)
})

events.delete('/:id', async (c) => {
  const id = c.req.param('id')

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return c.json(null, result.deletedCount === 1 ? 202 : 400)
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

export { events }
