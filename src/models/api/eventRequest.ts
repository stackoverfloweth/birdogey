import { EventPlayerRequest, EventResponse } from '@/models/api'

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
