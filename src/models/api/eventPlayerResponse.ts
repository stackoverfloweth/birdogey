import { ObjectId } from 'mongodb'

export type EventPlayerResponse = {
  _id: ObjectId,
  playerId: string,
  eventId: string,
  inForCtp: boolean,
  inForAce: boolean,
  score?: number,
  incomingTagId?: number,
  outgoingTagId?: number,
}