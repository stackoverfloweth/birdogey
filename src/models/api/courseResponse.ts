import { ObjectId } from 'mongodb'

export type CourseResponse = {
  _id: ObjectId,
  name: string,
  udiscId: string,
}