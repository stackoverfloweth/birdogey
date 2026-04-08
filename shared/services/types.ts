export type SeasonJson = {
  _id: string,
  courseId: string,
  name: string,
  start: string,
  end?: string,
  password: string,
  ctpInPennies?: number,
  aceInPennies?: number,
  course: {
    _id: string,
    name: string,
    udiscId?: string,
  },
}

export type UserAuthJson = {
  token?: string,
  _id?: string,
  name?: string,
  isAdmin?: boolean,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  seasons: SeasonJson[],
}

export type PlayerJson = {
  _id: string,
  seasonId: string,
  name: string,
  tagId: number,
  entryPaid?: boolean,
  udiscId?: string,
  imageUrl?: string,
}

export type EventPlayerJson = {
  _id: string,
  playerId: string,
  inForCtp: boolean,
  inForAce: boolean,
  score?: number,
  incomingTagId: number,
  outgoingTagId?: number,
}

export type EventJson = {
  _id: string,
  seasonId: string,
  created: string,
  completed?: string,
  name: string,
  notes?: string,
  players: EventPlayerJson[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpPlayerIds: string[],
  acePlayerIds: string[],
}

export type ImageKitAuthJson = {
  token: string,
  expire: number,
  signature: string,
}
