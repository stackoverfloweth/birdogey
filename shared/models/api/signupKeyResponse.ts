import { ObjectId } from 'mongodb'

export type SignupKeyResponse = {
  _id: ObjectId,
  seasonId: ObjectId,
}
