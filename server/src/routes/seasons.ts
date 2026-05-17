import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { SeasonResponse, UserSeasonResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { authMiddleware, getJwtPayload, requireAdmin } from '../middleware/auth.js'
import { checkSeasonAccess } from '../utilities/seasonAccess.js'
import { getNextAvailableTag } from '../utilities/getNextAvailableTag.js'
import { HttpError } from '../types.js'

const seasons = new Hono()

seasons.use(authMiddleware)

seasons.get('/', async (context) => {
  const token = getJwtPayload(context)

  if (token.isAdmin) {
    const db = getDb()
    const collection = db.collection<SeasonResponse>('seasons')
    const result = await collection.find().toArray()
    return context.json(result)
  }

  return context.json(token.seasons)
})

seasons.get('/:id', async (context) => {
  const id = context.req.param('id')
  const token = getJwtPayload(context)

  checkSeasonAccess(id, token)

  const db = getDb()
  const collection = db.collection<SeasonResponse>('seasons')
  const season = await collection.findOne({ _id: new ObjectId(id) })

  return context.json(season)
})

seasons.get('/:id/users', authMiddleware, async (context) => {
  const seasonId = context.req.param('id')

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
      { $match: { 'user.deletedAt': { $exists: false } } },
      { $lookup: { from: 'seasons', localField: 'seasonId', foreignField: '_id', as: 'season' } },
      { $unwind: '$season' },
      {
        $project: {
          _id: { $toString: '$user._id' },
          name: '$user.name',
          udiscId: '$user.udiscId',
          pdgaNumber: '$user.pdgaNumber',
          imageUrl: '$user.imageUrl',
          seasonId: { $toString: '$seasonId' },
          tagId: 1,
          entryPaid: 1,
          season: 1,
        },
      },
      { $sort: { name: 1 } },
    ])
    .toArray()

  return context.json(result)
})

seasons.put('/:id/users/:userId', requireAdmin, async (context) => {
  const seasonIdParam = context.req.param('id')
  const userIdParam = context.req.param('userId')
  const body = await context.req.json().catch(() => ({}))
  const token = getJwtPayload(context)

  checkSeasonAccess(seasonIdParam, token)

  const seasonId = new ObjectId(seasonIdParam)
  const userId = new ObjectId(userIdParam)

  const db = getDb()
  const userSeasons = db.collection<UserSeasonResponse>('userSeasons')

  const $set: Partial<UserSeasonResponse> = {}
  const $setOnInsert: Partial<UserSeasonResponse> = { _id: new ObjectId() }

  if (typeof body.tagId === 'number') {
    $set.tagId = body.tagId
  } else {
    $setOnInsert.tagId = await getNextAvailableTag(seasonId, userSeasons)
  }

  if (typeof body.entryPaid === 'boolean') {
    $set.entryPaid = body.entryPaid
  } else {
    $setOnInsert.entryPaid = true
  }

  const result = await userSeasons.updateOne(
    { userId, seasonId },
    { $set, $setOnInsert },
    { upsert: true },
  )

  return context.json(null, result.acknowledged ? 202 : 400)
})

seasons.delete('/:id/users/:userId', requireAdmin, async (context) => {
  const seasonIdParam = context.req.param('id')
  const userIdParam = context.req.param('userId')
  const token = getJwtPayload(context)

  checkSeasonAccess(seasonIdParam, token)

  const db = getDb()
  const userSeasons = db.collection<UserSeasonResponse>('userSeasons')

  const result = await userSeasons.deleteOne({
    seasonId: new ObjectId(seasonIdParam),
    userId: new ObjectId(userIdParam),
  })

  return context.json(null, result.deletedCount === 1 ? 202 : 400)
})

export { seasons }
