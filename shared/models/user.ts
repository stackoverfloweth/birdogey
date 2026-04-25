import { Season } from './season'

export type User = {
  accessToken?: string,
  refreshToken?: string,
  id: string,
  name: string,
  phoneNumber?: string,
  udiscId?: string,
  imageUrl?: string,
  isAdmin: boolean,
  isAuthorized: boolean,
  isReadonly: boolean,
  seasons: Season[],
}
