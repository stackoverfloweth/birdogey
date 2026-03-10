import { SeasonResponse } from './seasonResponse'

export type SeasonRequest = Omit<SeasonResponse, '_id'>
