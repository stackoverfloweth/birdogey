import { User } from './user.js'

export type UserSeason = User & {
  seasonId: string,
  tagId: number,
  entryPaid: boolean,
}
