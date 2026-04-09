import { PlayerResponse } from './playerResponse'

export type PlayerRequest = Omit<PlayerResponse, '_id'> & {
  seasonId?: string,
  tagId?: number,
  entryPaid?: boolean,
}
