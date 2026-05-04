import { User } from './user.js'

export type UserSeason = User & {
  seasonId: string,
  tagId: number,
  season: {
    _id: string,
    name: string,
  },
  entryPaid: boolean,
}
