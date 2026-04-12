import { User } from './user'

export type UserSeason = User & {
  seasonId: string,
  tagId: number,
  entryPaid: boolean,
}
