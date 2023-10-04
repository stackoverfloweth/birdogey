export type EventPlayer = {
  id: string,
  playerId: string,
  eventId: string,
  inForCtp: boolean,
  inForAce: boolean,
  score?: number,
  incomingTagId?: number,
  outgoingTagId?: number,
}