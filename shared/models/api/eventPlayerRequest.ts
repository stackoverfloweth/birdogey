import { EventPlayerResponse } from './eventPlayerResponse'

export type EventPlayerRequest = Omit<EventPlayerResponse, '_id' | 'userId' | 'inForCtp' | 'inForAce'> & {
  userId: string,
  inForCtp?: boolean,
  inForAce?: boolean,
}
