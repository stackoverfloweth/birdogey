import type { EventJson, EventPlayerJson, UserJson, UserSeasonJson, SeasonJson, UserAuthJson } from './types.js'
import { EventPlayer, Event, Season, User } from '../models/index.js'
import { UserSeason } from '../models/userSeason.js'

export function mapEventPlayer(source: EventPlayerJson): EventPlayer {
  return {
    id: source._id,
    userId: source.userId,
    inForCtp: source.inForCtp,
    inForAce: source.inForAce,
    score: source.score ?? undefined,
    incomingTagId: source.incomingTagId,
    outgoingTagId: source.outgoingTagId ?? undefined,
  }
}

export function mapEvent(source: EventJson): Event {
  return {
    id: source._id,
    seasonId: source.seasonId,
    created: new Date(source.created),
    start: source.start ? new Date(source.start) : new Date(source.created),
    completed: source.completed ? new Date(source.completed) : undefined,
    notes: source.notes ?? undefined,
    players: source.players.map(mapEventPlayer),
    ctpStartingBalance: source.ctpStartingBalance,
    aceStartingBalance: source.aceStartingBalance,
    ctpPerPlayer: source.ctpPerPlayer,
    acePerPlayer: source.acePerPlayer,
    ctpUserIds: source.ctpUserIds,
    aceUserIds: source.aceUserIds,
    ctpHole: source.ctpHole ?? undefined,
  }
}

export function mapUser(source: UserJson): User {
  return {
    id: source._id,
    name: source.name,
    udiscId: source.udiscId,
    pdgaNumber: source.pdgaNumber,
    imageUrl: source.imageUrl,
    isAdmin: false,
    isAuthorized: false,
    isReadonly: false,
    seasons: [],
  }
}

export function mapUserSeason(source: UserSeasonJson): UserSeason {
  return {
    ...mapUser(source),
    seasonId: source.seasonId,
    tagId: source.tagId,
    entryPaid: source.entryPaid,
  }
}

export function mapSeason(source: SeasonJson): Season {
  return {
    id: source._id,
    courseId: source.courseId,
    name: source.name,
    start: new Date(source.start),
    end: source.end ? new Date(source.end) : undefined,
    password: source.password,
    ctpPerPlayer: source.ctpInPennies,
    acePerPlayer: source.aceInPennies,
    course: {
      id: source.course._id,
      name: source.course.name,
      udiscId: source.course.udiscId,
      holeCount: source.course.holeCount,
    },
  }
}

export function mapUserAuth(source: UserAuthJson): User {
  return {
    accessToken: source.accessToken,
    refreshToken: source.refreshToken,
    id: source._id ?? '',
    name: source.name ?? '',
    phoneNumber: source.phoneNumber,
    udiscId: source.udiscId,
    pdgaNumber: source.pdgaNumber,
    imageUrl: source.imageUrl,
    isAdmin: source.isAdmin ?? false,
    isAuthorized: source.isAuthorized ?? false,
    isReadonly: source.isReadonly ?? false,
    seasons: source.seasons.map(mapSeason),
  }
}
