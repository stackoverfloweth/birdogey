import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { EventResponse, PlayerRequest, PlayerResponse, PlayerSeasonResponse, PlayerSignupRequest, SignupKeyResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag.js'

const players = new Hono()

players.get('/', authMiddleware, async (context) => {
  const seasonIds = context.req.query('seasonIds')?.split(',')
    .filter(Boolean) ?? []

  const token = getJwtPayload(context)
  const db = getDb()

  if (seasonIds.length) {
    seasonIds.forEach((seasonId) => checkSeasonAccess(seasonId, token))
  }

  if (!seasonIds.length) {
    const collection = db.collection<PlayerResponse>('players')
    const result = await collection.find({}).toArray()

    return context.json(result)
  }

  const collection = db.collection<PlayerSeasonResponse>('playerSeasons')

  const result = await collection
    .aggregate([
      { $match: { seasonId: { $in: seasonIds.map((id) => new ObjectId(id)) } } },
      { $lookup: { from: 'players', localField: 'playerId', foreignField: '_id', as: 'player' } },
      { $unwind: '$player' },
      {
        $group: {
          _id: '$player._id',
          name: { $first: '$player.name' },
          udiscId: { $first: '$player.udiscId' },
          imageUrl: { $first: '$player.imageUrl' },
        },
      },
    ])
    .toArray()

  return context.json(result)
})

players.get('/season/:seasonId', authMiddleware, async (context) => {
  const seasonId = context.req.param('seasonId')

  const token = getJwtPayload(context)
  const db = getDb()

  if (!seasonId) {
    throw new HttpError(400, 'seasonId is required')
  }

  checkSeasonAccess(seasonId, token)

  const collection = db.collection<PlayerSeasonResponse>('playerSeasons')

  const result = await collection
    .aggregate([
      { $match: { seasonId: new ObjectId(seasonId) } },
      { $lookup: { from: 'players', localField: 'playerId', foreignField: '_id', as: 'player' } },
      { $unwind: '$player' },
      {
        $project: {
          _id: { $toString: '$player._id' },
          name: '$player.name',
          udiscId: '$player.udiscId',
          imageUrl: '$player.imageUrl',
          seasonId: { $toString: '$seasonId' },
          tagId: 1,
          entryPaid: 1,
        },
      },
      { $sort: { tagId: 1 } },
    ])
    .toArray()

  return context.json(result)
})

players.get('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const player = await collection.findOne({ _id: new ObjectId(id) })

  return context.json(player)
})

players.post('/', authMiddleware, async (context) => {
  const body = await context.req.json()
  const token = getJwtPayload(context)

  if (!isValidRequest<PlayerRequest>(body, [
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  if (body.seasonId) {
    checkSeasonAccess(body.seasonId, token)
  }

  const db = getDb()
  const players = db.collection<PlayerResponse>('players')
  const playerSeasons = db.collection<PlayerSeasonResponse>('playerSeasons')
  const seasonId = new ObjectId(body.seasonId)

  const tagId = body.tagId ?? await getNextAvailableTag(seasonId, playerSeasons)

  const result = await players.insertOne({
    _id: new ObjectId(),
    name: body.name,
  })

  await playerSeasons.insertOne({
    _id: new ObjectId(),
    playerId: result.insertedId,
    seasonId,
    tagId,
    entryPaid: body.entryPaid ?? false,
  })

  return context.json(result.insertedId, 201)
})

players.put('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()
  const { seasonId, tagId, entryPaid, ...$set } = body
  const token = getJwtPayload(context)

  if (seasonId) {
    checkSeasonAccess(seasonId, token)
  }

  const db = getDb()
  const players = db.collection<PlayerResponse>('players')
  const playerSeasons = db.collection<PlayerSeasonResponse>('playerSeasons')

  const result = await players.updateOne({ _id: new ObjectId(id) }, { $set })

  if (seasonId && typeof seasonId === 'string') {
    const tagId = body.tagId ?? await getNextAvailableTag(seasonId, playerSeasons)

    await playerSeasons.updateOne(
      { playerId: new ObjectId(id), seasonId: new ObjectId(seasonId) },
      { $set: { tagId, entryPaid } },
      { upsert: true },
    )
  }

  return context.json(null, result.acknowledged ? 202 : 400)
})

players.delete('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return context.json(null, result.deletedCount === 1 ? 202 : 400)
})

players.put('/:id/checkin', authMiddleware, async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const playersCollection = db.collection<PlayerResponse>('players')
  const eventsCollection = db.collection<EventResponse>('events')

  const { eventId, tagId, udiscId } = body

  const result = await playersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { tagId, udiscId } })
  const event = await eventsCollection.findOne({ _id: new ObjectId(eventId as string) })

  if (event?.players.some((player) => player.playerId.toString() === id)) {
    throw new HttpError(400, 'Player already checked in')
  }

  await eventsCollection.updateOne({ _id: new ObjectId(eventId as string) }, {
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

  return context.json(null, result.acknowledged ? 202 : 400)
})

players.post('/signup', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<PlayerSignupRequest>(body, [
    ['key', 'string'],
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const keys = db.collection<SignupKeyResponse>('signup')
  const players = db.collection<PlayerResponse>('players')
  const playerSeasons = db.collection<PlayerSeasonResponse>('playerSeasons')

  const signupKey = await keys.findOne({ _id: new ObjectId(body.key) })

  if (!signupKey) {
    throw new HttpError(404, 'Invalid signup key')
  }

  const tagId = await getNextAvailableTag(signupKey.seasonId, playerSeasons)
  const { name, imageUrl } = body

  const result = await players.insertOne({
    _id: new ObjectId(),
    name,
    imageUrl,
  })

  await playerSeasons.insertOne({
    _id: new ObjectId(),
    playerId: result.insertedId,
    seasonId: signupKey.seasonId,
    entryPaid: false,
    tagId,
  })

  return context.json(result.insertedId, 201)
})

export { players }
