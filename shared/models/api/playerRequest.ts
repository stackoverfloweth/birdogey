import { PlayerResponse } from './playerResponse.js'

export type PlayerRequest = Omit<PlayerResponse, '_id'> & {
  seasonId?: string,
  tagId?: number,
  entryPaid?: boolean,
}
