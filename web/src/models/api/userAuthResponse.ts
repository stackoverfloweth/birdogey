import { ObjectId } from 'mongodb'
import { SeasonResponse } from '@/models/api'

export type UserAuthResponse = {
  _id: ObjectId,
  name?: string,
  seasons: SeasonResponse[],
  isAdmin?: boolean,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  token?: string,
}
