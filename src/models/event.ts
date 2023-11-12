import { EventPlayer } from '@/models'

export type Event = {
  id: string,
  seasonId: string,
  created: Date,
  completed?: Date,
  name: string,
  notes?: string,
  players: EventPlayer[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpPlayerIds: string[],
  acePlayerIds: string[],
}