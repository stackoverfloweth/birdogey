import { Event } from '../models'
import { EventSchemaInput } from '../schemas/eventSchema'

export function isActiveEvent(event: Event): boolean {
  return !event.completed
}

export function calculatePayoutSplit(pennies: number, numberOfWinners: number): number {
  return Math.floor(pennies / numberOfWinners)
}

export function toEventSchemaInput(event: Event): EventSchemaInput {
  return {
    notes: event.notes ?? undefined,
    players: event.players,
    ctpUserIds: event.ctpUserIds,
    aceUserIds: event.aceUserIds,
    ctpPerPlayer: event.ctpPerPlayer / 100,
    acePerPlayer: event.acePerPlayer / 100,
    ctpStartingBalance: event.ctpStartingBalance / 100,
    aceStartingBalance: event.aceStartingBalance / 100,
    ctpHole: event.ctpHole,
  }
}
