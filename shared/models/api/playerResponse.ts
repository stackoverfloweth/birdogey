import { ObjectId } from 'mongodb'

export type PlayerResponse = {
  _id: ObjectId,
  name: string,
  udiscId?: string,
  imageUrl?: string,
}
