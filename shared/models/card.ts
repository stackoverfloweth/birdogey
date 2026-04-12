import { User } from './user'

export type Card = {
  id: string,
  players: User[],
  maxPlayersCount: number,
}
