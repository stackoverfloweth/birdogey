import { Season } from './season'

export type User = {
  token?: string,
  id?: string,
  name?: string,
  isAdmin: boolean,
  isAuthorized: boolean,
  isReadonly: boolean,
  seasons: Season[],
}
