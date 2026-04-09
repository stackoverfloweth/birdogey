import { Player } from './player'

export type PlayerSeason = Player & {
  seasonId: string,
  tagId: number,
  entryPaid: boolean,
}
