import { EventPlayerResponse } from '@/models/api'

export type EventPlayerRequest = Omit<EventPlayerResponse, '_id'| 'playerId' | 'inForCtp' | 'inForAce'> & {
  playerId: string,
  inForCtp?: boolean,
  inForAce?: boolean,
}