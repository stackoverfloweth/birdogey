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
  const token = getJwtPayload(context)
  const db = getDb()
  const collection = db.collection<UserSeasonResponse>('userSeasons')

  const seasonIds = context.req.query('seasonIds')?.split(',')
    .filter((season) => {
      if (!season) {
        return false
      }

      checkSeasonAccess(season, token)

      return true
    })
    .map((season) => new ObjectId(season))

  const result = await collection
    .aggregate([
      ...(seasonIds !== undefined ? [{ $match: { seasonId: { $in: seasonIds } } }] : []),
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $match: { 'user.deletedAt': { $exists: false } } },
      {
        $group: {
          _id: '$user._id',
          name: { $first: '$user.name' },
          udiscId: { $first: '$user.udiscId' },
          pdgaNumber: { $first: '$user.pdgaNumber' },
          imageUrl: { $first: '$user.imageUrl' },
        },
      },
      { $sort: { name: 1 } },
    ])
    .toArray()

  return context.json(result)
})

users.get('/:id/seasons', authMiddleware, async (context) => {
  const userId = ObjectId.createFromHexString(context.req.param('id'))
  const db = getDb()

  const collection = db.collection<UserSeasonResponse>('userSeasons')

  const result = await collection.aggregate([
    { $match: { userId } },
    {
      $lookup: {
        from: 'seasons',
        let: { seasonId: '$seasonId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$seasonId'] },
                  { $or: [{ $eq: [{ $type: '$start' }, 'missing'] }, { $lte: ['$start', '$$NOW'] }] },
                  { $or: [{ $eq: [{ $type: '$end' }, 'missing'] }, { $gte: ['$end', '$$NOW'] }] },
                ],
              },
            },
          },
        ],
        as: 'season',
      },
    },
    { $unwind: '$season' },
    { $project: { _id: 1, seasonId: 1, tagId: 1, entryPaid: 1, season: 1 } },
  ]).toArray()

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

  const db = getDb()
  const usersCollection = db.collection<UserResponse>('users')

  const result = await usersCollection.insertOne({
    _id: new ObjectId(),
    name: body.name,
    udiscId: body.udiscId,
    pdgaNumber: body.pdgaNumber,
    imageUrl: body.imageUrl,
  })

  if (body.seasonId) {
    checkSeasonAccess(body.seasonId, token)
    const userSeasons = db.collection<UserSeasonResponse>('userSeasons')
    const seasonId = new ObjectId(body.seasonId)
    const tagId = body.tagId ?? await getNextAvailableTag(seasonId, userSeasons)

    await userSeasons.insertOne({
      _id: new ObjectId(),
      userId: result.insertedId,
      seasonId,
      tagId,
      entryPaid: body.entryPaid ?? true,
    })
  }

  return context.json(result.insertedId, 201)
})

users.put('/:id', authMiddleware, async (context) => {
  const id = context.req.param('id')
  const body = await context.req.json()
  const { seasonId, tagId, entryPaid, ...$set } = body
  const token = getJwtPayload(context)

  const db = getDb()
  const usersCollection = db.collection<UserResponse>('users')

  const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set })

  if (seasonId && typeof seasonId === 'string') {
    checkSeasonAccess(seasonId, token)
    const userSeasons = db.collection<UserSeasonResponse>('userSeasons')

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

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { deletedAt: new Date() } },
  )

  return context.json(null, result.matchedCount === 1 ? 202 : 400)
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
