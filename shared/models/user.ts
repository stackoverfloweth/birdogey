import { Season } from './season'

export type User = {
  token?: string,
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
