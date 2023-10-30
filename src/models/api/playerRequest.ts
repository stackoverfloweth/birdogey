import { PlayerResponse } from '@/models/api'

export type PlayerRequest = Omit<PlayerResponse, '_id' | 'seasonId' | 'tagId' | 'entryPaid'> & {
  seasonId: string,
  tagId?: number,
  entryPaid?: boolean,
}