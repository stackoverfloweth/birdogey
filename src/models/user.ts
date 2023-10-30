import { Season } from '@/models/season'

export type AdminUser = User & {
  id: string,
  name: string,
  isAdmin: true,
}

export type User = {
  id?: string,
  name?: string,
  isAdmin: boolean,
  isAuthorized: boolean,
  seasons: Season[],
}