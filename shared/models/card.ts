import { User } from './user.js'

export type Card = {
  id: string,
  players: User[],
  maxPlayersCount: number,
}
