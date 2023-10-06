export type Event = {
  id: string,
  seasonId: string,
  created: Date,
  name: string,
  notes?: string,
  completed?: Date,
  ctpPlayerIds?: string[],
  acePlayerIds?: string[],
  ctpPennyBalance?: number,
  acePennyBalance?: number,
}