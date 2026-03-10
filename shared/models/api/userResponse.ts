import { ObjectId } from 'mongodb'
import { SeasonResponse } from './seasonResponse'

export type UserResponse = {
  _id?: ObjectId,
  name?: string,
  isAdmin: boolean,
  isAuthorized: boolean,
  seasons: SeasonResponse[],
  token?: string,
}
