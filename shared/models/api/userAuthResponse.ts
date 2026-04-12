import { ObjectId } from 'mongodb'
import { SeasonResponse } from './seasonResponse'

export type UserAuthResponse = {
  _id: ObjectId,
  name?: string,
  phoneNumber?: string,
  udiscId?: string,
  imageUrl?: string,
  seasons: SeasonResponse[],
  isAdmin?: boolean,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  token?: string,
}
