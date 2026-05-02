import { Context, Hono } from 'hono'
import { BulkWriteResult, Db, ObjectId } from 'mongodb'
import { EventPlayerRequest, EventPlayerResponse, EventRequest, EventResponse, UserSeasonResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { HttpError, JwtPayload } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { isValidRequest } from '../utilities/requestValidation.js'

const events = new Hono()

events.use(authMiddleware)

async function getAllUserSeasonIds(userId: ObjectId, db: Db): Promise<ObjectId[]> {
  const userSeasonsCollection = db.collection<UserSeasonResponse>('userSeasons')

  const distinctSeasonIds = await userSeasonsCollection
    .aggregate<{ _id: ObjectId }>([
      { $match: { userId } },
      { $group: { _id: '$seasonId' } },
    ])
    .toArray()

  return distinctSeasonIds.map(({ _id }) => _id)
}

async function getSeasonIdsFromQueryOrAllUserSeasonIds(context: Context, token: JwtPayload, db: Db): Promise<ObjectId[]> {
  const userId = ObjectId.createFromHexString(token._id.toString())

  return context.req.query('seasonIds')?.split(',')
    .filter((season) => {
      if (!season) {
        return false
      }

      checkSeasonAccess(season, token)

      return true
    })
    .map((season) => new ObjectId(season)) ?? await getAllUserSeasonIds(userId, db)
}

events.get('/', async (context) => {
  const token = getJwtPayload(context)
  const db = getDb()
  const eventsCollection = db.collection<EventResponse>('events')
  const seasonIds = await getSeasonIdsFromQueryOrAllUserSeasonIds(context, token, db)

  const result = await eventsCollection.find({
    seasonId: { $in: seasonIds },
  })
    .sort({ created: -1 })
    .toArray()

  return context.json(result)
})

events.get('/next', async (context) => {
  const token = getJwtPayload(context)
  const db = getDb()
  const eventsCollection = db.collection<EventResponse>('events')
  const seasonIds = await getSeasonIdsFromQueryOrAllUserSeasonIds(context, token, db)

  const [result] = await eventsCollection.find({
    seasonId: { $in: seasonIds },
    created: { $lte: new Date() },
  })
    .sort({ created: 1 })
    .limit(1)
    .toArray()

  return context.json(result)
})

events.get('/last', async (context) => {
  const token = getJwtPayload(context)
  const db = getDb()
  const eventsCollection = db.collection<EventResponse>('events')
  const seasonIds = await getSeasonIdsFromQueryOrAllUserSeasonIds(context, token, db)

  const [result] = await eventsCollection.find({
    seasonId: { $in: seasonIds },
    completed: { $exists: true },
  })
    .sort({ completed: -1 })
    .limit(1)
    .toArray()

  return context.json(result)
})

events.get('/:id', async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const event = await collection.findOne({ _id: new ObjectId(id) })

  return context.json(event)
})

events.post('/', async (context) => {
  const body = await context.req.json()
  const token = getJwtPayload(context)

  if (!isValidRequest<EventRequest>(body, [
    ['seasonId', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  checkSeasonAccess(body.seasonId, token)

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const players = body.players?.map((eventPlayer: any) => ({
    ...eventPlayer,
    _id: new ObjectId(),
    userId: new ObjectId(eventPlayer.userId as string),
    inForCtp: eventPlayer.inForCtp ?? false,
    inForAce: eventPlayer.inForAce ?? false,
  })) ?? []

  const result = await collection.insertOne({
    _id: new ObjectId(),
    seasonId: new ObjectId(body.seasonId),
    created: new Date(),
    notes: body.notes,
    ctpStartingBalance: body.ctpStartingBalance ?? 0,
    aceStartingBalance: body.aceStartingBalance ?? 0,
    ctpPerPlayer: body.ctpPerPlayer ?? 0,
    acePerPlayer: body.acePerPlayer ?? 0,
    ctpUserIds: [],
    aceUserIds: [],
    ctpHole: body.ctpHole,
    players,
  })

  return context.json(result.insertedId, 201)
})

events.put('/:id', async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const players = body.players?.map((eventPlayer: any) => ({
    ...eventPlayer,
    _id: new ObjectId(),
    userId: new ObjectId(eventPlayer.userId as string),
    inForCtp: eventPlayer.inForCtp ?? false,
    inForAce: eventPlayer.inForAce ?? false,
  })) ?? []

  const ctpUserIds = body.ctpUserIds?.map((userId: string) => new ObjectId(userId)) ?? []
  const aceUserIds = body.aceUserIds?.map((userId: string) => new ObjectId(userId)) ?? []

  const result = await collection.updateOne({ _id: new ObjectId(id) }, {
    $set: {
      notes: body.notes,
      ctpStartingBalance: body.ctpStartingBalance,
      aceStartingBalance: body.aceStartingBalance,
      ctpPerPlayer: body.ctpPerPlayer,
      acePerPlayer: body.acePerPlayer,
      ctpHole: body.ctpHole,
      players,
      ctpUserIds,
      aceUserIds,
    },
  })

  return context.json(null, result.acknowledged ? 202 : 400)
})

events.put('/:id/complete', async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const requestPlayers = body.players ?? []
  const availableTags = requestPlayers.map(({ incomingTagId }: { incomingTagId: number }) => incomingTagId).sort((aTag: number, bTag: number) => aTag - bTag)
  const sortedByScore = requestPlayers.sort((aPlayer: EventPlayerResponse, bPlayer: EventPlayerResponse) => (aPlayer.score ?? Infinity) - (bPlayer.score ?? Infinity) || aPlayer.incomingTagId - bPlayer.incomingTagId)

  const players = requestPlayers.map((eventPlayer: EventPlayerRequest) => ({
    ...eventPlayer,
    _id: new ObjectId(),
    userId: new ObjectId(eventPlayer.userId),
    inForCtp: eventPlayer.inForCtp ?? false,
    inForAce: eventPlayer.inForAce ?? false,
    outgoingTagId: availableTags[sortedByScore.findIndex(({ userId }: { userId: ObjectId }) => userId.toString() === eventPlayer.userId)],
  }))

  const ctpUserIds = body.ctpUserIds?.map((userId: string) => new ObjectId(userId)) ?? []
  const aceUserIds = body.aceUserIds?.map((userId: string) => new ObjectId(userId)) ?? []

  const event = await collection.findOne({ _id: new ObjectId(id) })

  if (!event) {
    throw new HttpError(404, 'Event not found')
  }

  const result = await collection.updateOne({ _id: event._id }, {
    $set: {
      completed: new Date(),
      notes: body.notes,
      ctpHole: body.ctpHole,
      players,
      ctpUserIds,
      aceUserIds,
    },
  })

  await updateUserTags(db, event.seasonId, players)

  return context.json(null, result.acknowledged ? 202 : 400)
})

events.put('/:id/uncomplete', async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const event = await collection.findOne({ _id: new ObjectId(id) })

  if (!event) {
    throw new HttpError(404, 'Event not found')
  }

  const players = event.players.map(({ outgoingTagId, ...player }) => player)

  const result = await collection.updateOne({ _id: event._id }, {
    $set: { players },
    $unset: { completed: '' },
  })

  await revertUserTags(db, event.seasonId, event.players)

  return context.json(null, result.acknowledged ? 202 : 400)
})

events.delete('/:id', async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<EventResponse>('events')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return context.json(null, result.deletedCount === 1 ? 202 : 400)
})

function updateUserTags(db: Db, seasonId: ObjectId, players: EventPlayerResponse[]): Promise<BulkWriteResult> {
  const userUpdates: Partial<UserSeasonResponse>[] = players.map((player) => ({
    userId: new ObjectId(player.userId),
    tagId: player.outgoingTagId,
  }))

  const collection = db.collection<UserSeasonResponse>('userSeasons')

  return collection.bulkWrite(userUpdates.map(({ userId, tagId }) => ({
    updateOne: {
      filter: { userId, seasonId },
      update: { $set: { tagId } },
    },
  })))
}

function revertUserTags(db: Db, seasonId: ObjectId, players: EventPlayerResponse[]): Promise<BulkWriteResult> {
  const collection = db.collection<UserSeasonResponse>('userSeasons')

  return collection.bulkWrite(players.map((player) => ({
    updateOne: {
      filter: { userId: new ObjectId(player.userId), seasonId },
      update: { $set: { tagId: player.incomingTagId } },
    },
  })))
}

export { events }
