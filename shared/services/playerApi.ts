import type { HttpClient } from './httpClient'
import type { PlayerJson } from './types'
import { mapPlayer } from './mappers'
import { Player } from '../models'
import { PlayerCheckInRequest, PlayerRequest, PlayerSignupRequest } from '../models/api'

export function createPlayerApi(client: HttpClient) {
  return {
    getById(id: string): Promise<Player> {
      return client.get<PlayerJson>(`/players/${id}`).then(mapPlayer)
    },
    getList(seasonId: string): Promise<Player[]> {
      return client.get<PlayerJson[]>('/players', { seasonId }).then((data) => data.map(mapPlayer))
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
