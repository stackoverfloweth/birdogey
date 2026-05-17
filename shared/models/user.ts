import { Season } from './season.js'

export type User = {
  accessToken?: string,
  refreshToken?: string,
  id: string,
  name: string,
  phoneNumber?: string,
  udiscId?: string,
  pdgaNumber?: string,
  imageUrl?: string,
  role: string,
  isAuthorized: boolean,
  isReadonly: boolean,
  seasons: Season[],
}
