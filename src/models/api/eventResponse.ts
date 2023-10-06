import { ObjectId } from 'mongodb'

export type EventResponse = {
  _id: ObjectId,
  seasonId: string,
  created: Date,
  name: string,
  notes?: string,
  completed?: Date,
  ctpPlayerIds?: string[],
  acePlayerIds?: string[],
  ctpPennyBalance?: number,
  acePennyBalance?: number,
}