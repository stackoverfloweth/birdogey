import { ObjectId } from 'mongodb'

export type SeasonResponse = {
  _id: ObjectId,
  courseId: ObjectId,
  name: string,
  start: Date,
  end?: Date,
  password: string,
}