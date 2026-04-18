import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { EventResponse, UserRequest, UserResponse, UserSeasonResponse, SignupRequest, SignupKeyResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag.js'

const users = new Hono()

users.get('/', authMiddleware, async (context) => {
  const seasonIds = context.req.query('seasonIds')?.split(',')
    .filter(Boolean) ?? []

  const token = getJwtPayload(context)
  const db = getDb()

  if (seasonIds.length) {
    seasonIds.forEach((seasonId) => checkSeasonAccess(seasonId, token))
  }

  if (!seasonIds.length) {
    const collection = db.collection<UserResponse>('users')
    const result = await collection.find({}).toArray()

    return context.json(result)
  }

  const collection = db.collection<UserSeasonResponse>('userSeasons')

  const result = await collection
    .aggregate([
      { $match: { seasonId: { $in: seasonIds.map((id) => new ObjectId(id)) } } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user._id',
          name: { $first: '$user.name' },
          udiscId: { $first: '$user.udiscId' },
          imageUrl: { $first: '$user.imageUrl' },
        },
      },
    ])
    .toArray()

  return context.json(result)
})

users.get('/season/:seasonId', authMiddleware, async (context) => {
  const seasonId = context.req.param('seasonId')

  const token = getJwtPayload(context)
  const db = getDb()

  if (!seasonId) {
    throw new HttpError(400, 'seasonId is required')
  }

  checkSeasonAccess(seasonId, token)

  const collection = db.collection<UserSeasonResponse>('userSeasons')

  const result = await collection
    .aggregate([
      { $match: { seasonId: new ObjectId(seasonId) } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          _id: { $toString: '$user._id' },
          name: '$user.name',
          udiscId: '$user.udiscId',
          imageUrl: '$user.imageUrl',
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

users.get('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<UserResponse>('users')

  const user = await collection.findOne({ _id: new ObjectId(id) })

  return context.json(user)
})

users.post('/', authMiddleware, async (context) => {
  const body = await context.req.json()
  const token = getJwtPayload(context)

  if (!isValidRequest<UserRequest>(body, [
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  if (body.seasonId) {
    checkSeasonAccess(body.seasonId, token)
  }

  const db = getDb()
  const usersCollection = db.collection<UserResponse>('users')
  const userSeasons = db.collection<UserSeasonResponse>('userSeasons')
  const seasonId = new ObjectId(body.seasonId)

  const tagId = body.tagId ?? await getNextAvailableTag(seasonId, userSeasons)

  const result = await usersCollection.insertOne({
    _id: new ObjectId(),
    name: body.name,
  })

  await userSeasons.insertOne({
    _id: new ObjectId(),
    userId: result.insertedId,
    seasonId,
    tagId,
    entryPaid: body.entryPaid ?? false,
  })

  return context.json(result.insertedId, 201)
})

users.put('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()
  const { seasonId, tagId, entryPaid, ...$set } = body
  const token = getJwtPayload(context)

  if (seasonId) {
    checkSeasonAccess(seasonId, token)
  }

  const db = getDb()
  const usersCollection = db.collection<UserResponse>('users')
  const userSeasons = db.collection<UserSeasonResponse>('userSeasons')

  const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set })

  if (seasonId && typeof seasonId === 'string') {
    const resolvedTagId = body.tagId ?? await getNextAvailableTag(seasonId, userSeasons)

    await userSeasons.updateOne(
      { userId: new ObjectId(id), seasonId: new ObjectId(seasonId) },
      { $set: { tagId: resolvedTagId, entryPaid } },
      { upsert: true },
    )
  }

  return context.json(null, result.acknowledged ? 202 : 400)
})

users.delete('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<UserResponse>('users')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return context.json(null, result.deletedCount === 1 ? 202 : 400)
})

users.put('/:id/checkin', authMiddleware, async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()

  if (!body) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const usersCollection = db.collection<UserResponse>('users')
  const eventsCollection = db.collection<EventResponse>('events')

  const { eventId, tagId, udiscId } = body

  const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { tagId, udiscId } })
  const event = await eventsCollection.findOne({ _id: new ObjectId(eventId as string) })

  if (event?.players.some((player) => player.userId.toString() === id)) {
    throw new HttpError(400, 'User already checked in')
  }

  await eventsCollection.updateOne({ _id: new ObjectId(eventId as string) }, {
    $push: {
      players: {
        _id: new ObjectId(),
        userId: new ObjectId(id),
        incomingTagId: tagId,
        inForCtp: false,
        inForAce: false,
      },
    },
  })

  return context.json(null, result.acknowledged ? 202 : 400)
})

users.post('/signup', async (context) => {
  const body = await context.req.json()

  if (!isValidRequest<SignupRequest>(body, [
    ['key', 'string'],
    ['name', 'string'],
  ])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const keys = db.collection<SignupKeyResponse>('signup')
  const usersCollection = db.collection<UserResponse>('users')
  const userSeasons = db.collection<UserSeasonResponse>('userSeasons')

  const signupKey = await keys.findOne({ _id: new ObjectId(body.key) })

  if (!signupKey) {
    throw new HttpError(404, 'Invalid signup key')
  }

  const tagId = await getNextAvailableTag(signupKey.seasonId, userSeasons)
  const { name, imageUrl } = body

  const result = await usersCollection.insertOne({
    _id: new ObjectId(),
    name,
    imageUrl,
  })

  await userSeasons.insertOne({
    _id: new ObjectId(),
    userId: result.insertedId,
    seasonId: signupKey.seasonId,
    entryPaid: false,
    tagId,
  })

  return context.json(result.insertedId, 201)
})

export { users }
