import { ObjectId } from 'mongodb'
import { EventPlayerResponse } from './eventPlayerResponse.js'

export type EventResponse = {
  _id: ObjectId,
  seasonId: ObjectId,
  created: Date,
  start: Date,
  completed?: Date,
  notes?: string,
  players: EventPlayerResponse[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpUserIds: ObjectId[],
  aceUserIds: ObjectId[],
  ctpHole?: number,
}
