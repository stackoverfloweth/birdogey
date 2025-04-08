import { SeasonResponse } from '@/models/api'

export type SeasonRequest = Omit<SeasonResponse, '_id'>
