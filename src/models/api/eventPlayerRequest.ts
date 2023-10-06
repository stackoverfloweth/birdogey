import { EventPlayerResponse } from '@/models/api/eventPlayerResponse'

export type EventPlayerRequest = Omit<EventPlayerResponse, '_id' | 'inForCtp' | 'inForAce'> & {
  inForCtp?: boolean,
  inForAce?: boolean,
}