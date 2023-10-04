import { ObjectId } from 'mongodb'

export type EventResponse = {
  _id: ObjectId,
  name: string,
  notes?: string,
  ctpPlayerId?: string,
  acePlayerId?: string,
}