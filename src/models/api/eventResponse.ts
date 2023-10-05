import { ObjectId } from 'mongodb'

export type EventResponse = {
  _id: ObjectId,
  seasonId: string,
  name: string,
  notes?: string,
  ctpPlayerId?: string,
  acePlayerId?: string,
}