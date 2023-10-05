import { ObjectId } from 'mongodb'

export type PlayerResponse = {
  _id: ObjectId,
  seasonId: string,
  name: string,
  entryPaid?: boolean,
}