import { SeasonResponse } from '@/models/api/seasonResponse'

export type SeasonRequest = Omit<SeasonResponse, '_id'>