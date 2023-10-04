import { PlayerResponse } from '@/models/api/playerResponse'

export type PlayerRequest = Omit<PlayerResponse, '_id'>