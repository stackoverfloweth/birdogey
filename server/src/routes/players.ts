import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { EventResponse, PlayerCheckInRequest, PlayerRequest, PlayerResponse, PlayerSignupRequest, SignupKeyResponse } from '@/models/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag.js'

const players = new Hono()

players.get('/', authMiddleware, async (c) => {
  const seasonId = c.req.query('seasonId')

  if (!seasonId) {
    throw new HttpError(400, 'seasonId query parameter is required')
  }

  const token = getJwtPayload(c)
  checkSeasonAccess(seasonId, token)

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const result = await collection
    .find({ seasonId: new ObjectId(seasonId) })
    .sort({ tagId: 1 })
    .toArray()

  return c.json(result)
})

players.get('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const player = await collection.findOne({ _id: new ObjectId(id) })

  return c.json(player)
})

players.post('/', authMiddleware, async (c) => {
  const body = await c.req.json()
  const token = getJwtPayload(c)

  if (!isValidRequest<PlayerRequest>(body, [
    ['seasonId', 'string'],
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  checkSeasonAccess(body.seasonId, token)

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')
  const seasonId = new ObjectId(body.seasonId)

  const tagId = body.tagId ?? await getNextAvailableTag(seasonId, collection)

  const result = await collection.insertOne({
    _id: new ObjectId(),
    seasonId,
    name: body.name,
    tagId,
    entryPaid: body.entryPaid ?? false,
  })

  return c.json(result.insertedId, 201)
})

players.put('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json() as Partial<PlayerRequest>
  const token = getJwtPayload(c)

  if (!isValidRequest<PlayerRequest>(body, [
    ['seasonId', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  checkSeasonAccess(body.seasonId, token)

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const { seasonId, ...$set } = body

  const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set })

  return c.json(null, result.acknowledged ? 202 : 400)
})

players.delete('/:id', authMiddleware, async (c) => {
  const id = c.req.param('id')

  const db = getDb()
  const collection = db.collection<PlayerResponse>('players')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return c.json(null, result.deletedCount === 1 ? 202 : 400)
})

players.put('/:id/checkin', authMiddleware, async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json() as PlayerCheckInRequest

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const playersCollection = db.collection<PlayerResponse>('players')
  const eventsCollection = db.collection<EventResponse>('events')

  const { eventId, tagId, udiscId } = body

  const result = await playersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { tagId, udiscId } })
  const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) })

  if (event?.players.some(player => player.playerId.toString() === id)) {
    throw new HttpError(400, 'Player already checked in')
  }

  await eventsCollection.updateOne({ _id: new ObjectId(eventId) }, {
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

  return c.json(null, result.acknowledged ? 202 : 400)
})

players.post('/signup', async (c) => {
  const body = await c.req.json()

  if (!isValidRequest<PlayerSignupRequest>(body, [
    ['key', 'string'],
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const keys = db.collection<SignupKeyResponse>('signup')
  const playersCollection = db.collection<PlayerResponse>('players')

  const signupKey = await keys.findOne({ _id: new ObjectId(body.key) })

  if (!signupKey) {
    throw new HttpError(404, 'Invalid signup key')
  }

  const tagId = await getNextAvailableTag(signupKey.seasonId, playersCollection)
  const { name, imageUrl } = body

  const result = await playersCollection.insertOne({
    _id: new ObjectId(),
    seasonId: signupKey.seasonId,
    name,
    imageUrl,
    tagId,
    entryPaid: false,
  })

  return c.json(result.insertedId, 201)
})

export { players }
