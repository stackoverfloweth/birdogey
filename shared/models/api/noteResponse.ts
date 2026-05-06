import { ObjectId } from 'mongodb'

export type NoteResponse = {
  _id: ObjectId,
  userId: ObjectId,
  authorId: ObjectId,
  content: string,
  createdAt: Date,
  updatedAt: Date,
}
