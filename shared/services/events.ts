import { Event } from '../models'

export function isActiveEvent(event: Event): boolean {
  return !event.completed
}

export function calculatePayoutSplit(pennies: number, numberOfWinners: number): number {
  return Math.floor(pennies / numberOfWinners)
}
