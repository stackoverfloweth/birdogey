export type Event = {
  id: string,
  seasonId: string,
  created: Date,
  name: string,
  notes?: string,
  ctpPlayerId?: string,
  acePlayerId?: string,
}