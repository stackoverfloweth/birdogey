import { ObjectId } from 'mongodb'
import { SeasonResponse } from './seasonResponse'

export type UserAuthResponse = {
  _id: ObjectId,
  name?: string,
  seasons: SeasonResponse[],
  isAdmin?: boolean,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  token?: string,
}
