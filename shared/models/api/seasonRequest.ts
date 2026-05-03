import { SeasonResponse } from './seasonResponse.js'

export type SeasonRequest = Omit<SeasonResponse, '_id'>
