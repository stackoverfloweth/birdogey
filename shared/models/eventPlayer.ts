export type EventPlayer = {
  id: string,
  playerId: string,
  inForCtp: boolean,
  inForAce: boolean,
  score?: number,
  incomingTagId: number,
  outgoingTagId?: number,
}
