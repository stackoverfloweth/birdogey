type Event = {
  ctpPerPlayer?: number,
  acePerPlayer?: number,
  ctpStartingBalance?: number,
  aceStartingBalance?: number,
  ctpPlayerIds?: string[],
  acePlayerIds?: string[],
  players: {
    inForCtp?: boolean,
    inForAce?: boolean,
  }[],
}

export function calculateEventCtpPotIfNoWinners(event: Event): number {
  const someoneWonCtp = !!event.ctpPlayerIds?.length
  if (someoneWonCtp) {
    return 0
  }

  return calculateEventCtpPot(event)
}

export function calculateEventCtpPot(event: Event): number {
  return event.players.reduce((sum, { inForCtp }) => {
    if (!inForCtp) {
      return sum
    }

    return sum + (event.ctpPerPlayer ?? 0)
  }, event.ctpStartingBalance ?? 0)
}

export function calculateEventAcePotIfNoWinners(event: Event): number {
  const someoneWonAce = !!event.acePlayerIds?.length
  if (someoneWonAce) {
    return 0
  }

  return calculateEventAcePot(event)
}

export function calculateEventAcePot(event: Event): number {
  return event.players.reduce((sum, { inForAce }) => {
    if (!inForAce) {
      return sum
    }

    return sum + (event.acePerPlayer ?? 0)
  }, event.aceStartingBalance ?? 0)
}