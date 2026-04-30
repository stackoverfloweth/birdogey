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

  const result = await collection
    .find({
      userId: new ObjectId(userId),
      authorId: new ObjectId(token._id.toString()),
    })
    .sort({ createdAt: -1 })
    .toArray()

  return context.json(result)
})

notes.post('/user/:userId', authMiddleware, async (context) => {
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

  const result = await collection.insertOne({
    _id: new ObjectId(),
    userId: new ObjectId(userId),
    authorId: new ObjectId(token._id.toString()),
    content: body.content,
    createdAt: now,
    updatedAt: now,
  })

  return context.json(result.insertedId, 201)
})

notes.put('/:id', authMiddleware, async (context) => {
  const token = getJwtPayload(context)
  checkAdmin(token)

  const id = context.req.param('id')
  const body = await context.req.json()

  if (!isValidRequest<NoteRequest>(body, [['content', 'string']])) {
    throw new HttpError(400, 'Invalid request')
  }

  const db = getDb()
  const collection = db.collection<NoteResponse>('notes')

  const result = await collection.updateOne(
    {
      _id: new ObjectId(id),
      authorId: new ObjectId(token._id.toString()),
    },
    {
      $set: {
        content: body.content,
        updatedAt: new Date(),
      },
    },
  )

  if (result.matchedCount === 0) {
    throw new HttpError(404, 'Note not found')
  }

  return context.json(null, 202)
})

notes.delete('/:id', authMiddleware, async (context) => {
  const token = getJwtPayload(context)
  checkAdmin(token)

  const id = context.req.param('id')

  const db = getDb()
  const collection = db.collection<NoteResponse>('notes')

  const result = await collection.deleteOne({
    _id: new ObjectId(id),
    authorId: new ObjectId(token._id.toString()),
  })

  if (result.deletedCount === 0) {
    throw new HttpError(404, 'Note not found')
  }

  return context.json(null, 202)
})

export { notes }
