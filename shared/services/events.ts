import { Event } from '../models'

export function isActiveEvent(event: Event): boolean {
  return !event.completed
}
