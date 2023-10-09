import { EventPlayerRequest } from '@/models/api/eventPlayerRequest'
import { EventResponse } from '@/models/api/eventResponse'

export type EventRequest = Omit<EventResponse, '_id' | 'seasonId' | 'players' | 'created' | 'ctpStartingBalance' | 'aceStartingBalance' | 'ctpPlayerIds' | 'acePlayerIds'> & {
  seasonId: string,
  players?: EventPlayerRequest[],
  ctpStartingBalance?: number,
  aceStartingBalance?: number,
  ctpPlayerIds?: string[],
  acePlayerIds?: string[],
}