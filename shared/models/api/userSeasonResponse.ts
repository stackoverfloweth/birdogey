import { ObjectId } from 'mongodb'

export type UserSeasonResponse = {
  _id: ObjectId,
  userId: ObjectId,
  seasonId: ObjectId,
  tagId: number,
  entryPaid: boolean,
}
