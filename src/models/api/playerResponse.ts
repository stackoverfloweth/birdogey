import { ObjectId } from 'mongodb'

export type PlayerResponse = {
  _id: ObjectId,
  name: string,
  entryPaid?: boolean,
}