import { EventPlayerRequest } from './eventPlayerRequest'
import { EventResponse } from './eventResponse'

export type EventRequest = Omit<EventResponse, '_id' | 'seasonId' | 'players' | 'created' | 'ctpStartingBalance' | 'aceStartingBalance' | 'ctpPlayerIds' | 'acePlayerIds'> & {
  seasonId: string,
  players?: EventPlayerRequest[],
  ctpStartingBalance?: number,
  aceStartingBalance?: number,
  ctpPerPlayer?: number,
  acePerPlayer?: number,
  ctpPlayerIds?: string[],
  acePlayerIds?: string[],
}
