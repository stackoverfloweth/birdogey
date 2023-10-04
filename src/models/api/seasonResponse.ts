import { ObjectId } from 'mongodb'

export type SeasonResponse = {
  _id: ObjectId,
  name: string,
  ctpInPennies?: number,
  aceInPennies?: number,
  start: Date,
  end?: Date,
  courseId?: string,
}