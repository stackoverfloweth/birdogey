import { ObjectId } from 'mongodb'

export type PlayerSeasonResponse = {
  _id: ObjectId,
  playerId: ObjectId,
  seasonId: ObjectId,
  tagId: number,
  entryPaid: boolean,
}
