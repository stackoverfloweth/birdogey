import { ObjectId } from 'mongodb'

export type UserResponse = {
  _id: ObjectId,
  name: string,
  password: string,
  courseIds: ObjectId[],
}
