import { Player } from './player.js'

export type PlayerSeason = Player & {
  seasonId: string,
  tagId: number,
  entryPaid: boolean,
}
