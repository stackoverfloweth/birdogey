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
    holeCount?: number,
  },
}

export type UserAuthJson = {
  accessToken?: string,
  refreshToken?: string,
  _id?: string,
  name?: string,
  phoneNumber?: string,
  udiscId?: string,
  pdgaNumber?: string,
  imageUrl?: string,
  isAdmin?: boolean,
  isAuthorized?: boolean,
  isReadonly?: boolean,
  seasons: SeasonJson[],
}

export type UserJson = {
  _id: string,
  name: string,
  phoneNumber?: string,
  udiscId?: string,
  pdgaNumber?: string,
  imageUrl?: string,
}

export type UserSeasonJson = UserJson & {
  seasonId: string,
  tagId: number,
  entryPaid: boolean,
}

export type EventPlayerJson = {
  _id: string,
  userId: string,
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
  notes?: string,
  players: EventPlayerJson[],
  ctpStartingBalance: number,
  aceStartingBalance: number,
  ctpPerPlayer: number,
  acePerPlayer: number,
  ctpUserIds: string[],
  aceUserIds: string[],
  ctpHole?: number,
}

export type ImageKitAuthJson = {
  token: string,
  expire: number,
  signature: string,
}
