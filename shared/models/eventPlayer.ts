export type EventPlayer = {
  id: string,
  userId: string,
  inForCtp: boolean,
  inForAce: boolean,
  score?: number,
  incomingTagId: number,
  outgoingTagId?: number,
}
