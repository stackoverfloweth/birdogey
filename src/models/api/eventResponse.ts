import { ObjectId } from 'mongodb'
import { EventPlayerResponse } from '@/models/api'

export type EventResponse = {
  _id: ObjectId,
  seasonId: ObjectId,
  created: Date,
  completed?: Date,
  name: string,
  notes?: string,
  players: EventPlayerResponse[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpPlayerIds: ObjectId[],
  acePlayerIds: ObjectId[],
}