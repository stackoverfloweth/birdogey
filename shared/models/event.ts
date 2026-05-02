import { EventPlayer } from './eventPlayer'

export type Event = {
  id: string,
  seasonId: string,
  created: Date,
  completed?: Date,
  notes?: string,
  players: EventPlayer[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpUserIds: string[],
  aceUserIds: string[],
  ctpHole?: number,
}
