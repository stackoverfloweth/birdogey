import { ObjectId } from 'mongodb'
import { SeasonResponse } from './seasonResponse.js'

export type UserAuthResponse = {
  _id: ObjectId,
  name?: string,
  phoneNumber?: string,
  udiscId?: string,
  imageUrl?: string,
  seasons: SeasonResponse[],
  role?: string,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  accessToken?: string,
  refreshToken?: string,
}
