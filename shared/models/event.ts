import { EventPlayer } from './eventPlayer.js'

export type Event = {
  id: string,
  seasonId: string,
  created: Date,
  start: Date,
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
