import { Player } from './player'

export type Card = {
  id: string,
  players: Player[],
  maxPlayersCount: number,
}
