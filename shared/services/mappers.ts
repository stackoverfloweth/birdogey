import type { EventJson, EventPlayerJson, PlayerJson, SeasonJson, UserAuthJson } from './types'
import { EventPlayer, Event, Player, Season, User } from '../models'

export function mapEventPlayer(source: EventPlayerJson): EventPlayer {
  return {
    id: source._id,
    playerId: source.playerId,
    inForCtp: source.inForCtp,
    inForAce: source.inForAce,
    score: source.score,
    incomingTagId: source.incomingTagId,
    outgoingTagId: source.outgoingTagId,
  }
}

export function mapEvent(source: EventJson): Event {
  return {
    id: source._id,
    seasonId: source.seasonId,
    created: new Date(source.created),
    completed: source.completed ? new Date(source.completed) : undefined,
    name: source.name,
    notes: source.notes,
    players: source.players.map(mapEventPlayer),
    ctpStartingBalance: source.ctpStartingBalance,
    aceStartingBalance: source.aceStartingBalance,
    ctpPerPlayer: source.ctpPerPlayer,
    acePerPlayer: source.acePerPlayer,
    ctpPlayerIds: source.ctpPlayerIds,
    acePlayerIds: source.acePlayerIds,
  }
}

export function mapPlayer(source: PlayerJson): Player {
  return {
    id: source._id,
    seasonId: source.seasonId,
    name: source.name,
    tagId: source.tagId,
    entryPaid: source.entryPaid,
    udiscId: source.udiscId,
    imageUrl: source.imageUrl,
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
    },
  }
}

export function mapUser(source: UserAuthJson): User {
  return {
    token: source.token,
    id: source._id,
    name: source.name,
    isAdmin: source.isAdmin ?? false,
    isAuthorized: source.isAuthorized ?? false,
    isReadonly: source.isReadonly ?? false,
    seasons: source.seasons.map(mapSeason),
  }
}
