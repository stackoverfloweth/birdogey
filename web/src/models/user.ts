import { Season } from '@/models'

export type User = {
  token?: string,
  id?: string,
  name?: string,
  isAdmin: boolean,
  isAuthorized: boolean,
  isReadonly: boolean,
  seasons: Season[],
}
