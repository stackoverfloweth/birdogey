import { Player } from '@/models'

export type Card = {
  id: string,
  players: Player[],
  maxPlayersCount: number,
}
