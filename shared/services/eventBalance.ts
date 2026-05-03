import { EventSchemaInput } from '../schemas/eventSchema.js'

export function calculateEventCtpPotIfNoWinners(event: EventSchemaInput): number {
  const someoneWonCtp = !!event.ctpUserIds?.length
  if (someoneWonCtp) {
    return 0
  }

  return calculateEventCtpPot(event)
}

export function calculateEventCtpPot(event: EventSchemaInput): number {
  const players = event.players ?? []

  return players.reduce((sum, { inForCtp }) => {
    if (!inForCtp) {
      return sum
    }

    return sum + (event.ctpPerPlayer ?? 0)
  }, event.ctpStartingBalance ?? 0)
}

export function calculateEventAcePotIfNoWinners(event: EventSchemaInput): number {
  const someoneWonAce = !!event.aceUserIds?.length
  if (someoneWonAce) {
    return 0
  }

  return calculateEventAcePot(event)
}

export function calculateEventAcePot(event: EventSchemaInput): number {
  const players = event.players ?? []

  return players.reduce((sum, { inForAce }) => {
    if (!inForAce) {
      return sum
    }

    return sum + (event.acePerPlayer ?? 0)
  }, event.aceStartingBalance ?? 0)
}
