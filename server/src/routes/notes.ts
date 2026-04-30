import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { NoteRequest, NoteResponse } from '@birdogey/shared/api'
import { getDb } from '../db.js'
import { HttpError } from '../types.js'
import { authMiddleware, getJwtPayload } from '../middleware/auth.js'
import { isValidRequest } from '../utilities/requestValidation.js'
import { checkAdmin } from '../utilities/checkAdmin.js'

const notes = new Hono()

notes.get('/user/:userId', authMiddleware, async (context) => {
  const token = getJwtPayload(context)
  checkAdmin(token)

  const userId = context.req.param('userId')

  if (!userId) {
    throw new HttpError(400, 'userId is required')
  }

  const db = getDb()
  const collection = db.collection<NoteResponse>('notes')

  const note = await collection.findOne({
    userId: new ObjectId(userId),
    authorId: new ObjectId(token._id.toString()),
  })

  return context.json(note)
})

notes.put('/user/:userId', authMiddleware, async (context) => {
  const token = getJwtPayload(context)
  checkAdmin(token)

  const userId = context.req.param('userId')
  const body = await context.req.json()

  if (!userId) {
    throw new HttpError(400, 'userId is required')
  }

  if (!isValidRequest<NoteRequest>(body, [['content', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<NoteResponse>('notes')
  const now = new Date()

  await collection.updateOne(
    {
      userId: new ObjectId(userId),
      authorId: new ObjectId(token._id.toString()),
    },
    {
      $set: { content: body.content, updatedAt: now },
      $setOnInsert: { _id: new ObjectId(), createdAt: now },
    },
    { upsert: true },
  )

  return context.json(null, 202)
})

export { notes }
