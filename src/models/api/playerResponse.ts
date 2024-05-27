import { ObjectId } from 'mongodb'

export type PlayerResponse = {
  _id: ObjectId,
  seasonId: ObjectId,
  name: string,
  tagId: number,
  entryPaid: boolean,
  udiscId?: string,
}