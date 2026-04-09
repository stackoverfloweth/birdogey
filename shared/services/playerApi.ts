import type { HttpClient } from './httpClient'
import type { PlayerJson, PlayerSeasonJson } from './types'
import { mapPlayer, mapPlayerSeason } from './mappers'
import { Player, PlayerSeason } from '../models'
import { PlayerCheckInRequest, PlayerRequest, PlayerSignupRequest } from '../models/api'

export function createPlayerApi(client: HttpClient) {
  return {
    getById(id: string): Promise<Player> {
      return client.get<PlayerJson>(`/players/${id}`).then(mapPlayer)
    },
    getList(): Promise<Player[]> {
      return client.get<PlayerJson[]>('/players').then((data) => data.map(mapPlayer))
    },
    getSeasonList(seasonId: string): Promise<PlayerSeason[]> {
      return client.get<PlayerSeasonJson[]>(`/players/season/${seasonId}`).then((data) => data.map(mapPlayerSeason))
    },
    create(request: PlayerRequest): Promise<string> {
      return client.post<string>('/players', request)
    },
    update(id: string, request: Partial<PlayerRequest>): Promise<string> {
      return client.put<string>(`/players/${id}`, request)
    },
    remove(id: string): Promise<string> {
      return client.delete<string>(`/players/${id}`)
    },
    checkin(id: string, request: Partial<PlayerCheckInRequest>): Promise<string> {
      return client.put<string>(`/players/${id}/checkin`, request)
    },
    signup(request: PlayerSignupRequest): Promise<string> {
      return client.post<string>('/players/signup', request)
    },
  }
}

export type PlayerApi = ReturnType<typeof createPlayerApi>
