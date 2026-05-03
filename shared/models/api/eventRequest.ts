import { EventPlayerRequest } from './eventPlayerRequest.js'
import { EventResponse } from './eventResponse.js'

export type EventRequest = Omit<EventResponse, '_id' | 'seasonId' | 'players' | 'created' | 'ctpStartingBalance' | 'aceStartingBalance' | 'ctpPerPlayer' | 'acePerPlayer' | 'ctpUserIds' | 'aceUserIds'> & {
  seasonId: string,
  players?: EventPlayerRequest[],
  ctpStartingBalance?: number,
  aceStartingBalance?: number,
  ctpPerPlayer?: number,
  acePerPlayer?: number,
  ctpUserIds?: string[],
  aceUserIds?: string[],
}
