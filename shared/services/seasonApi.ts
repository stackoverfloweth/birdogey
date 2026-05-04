import type { HttpClient } from './httpClient.js'
import type { SeasonJson, UserSeasonJson } from './types.js'
import { mapSeason, mapUserSeason } from './mappers.js'
import { Season } from '../models/season.js'
import { UserSeasonSchemaInput } from '../schemas/userSeasonSchema.js'
import { UserSeason } from '../models/userSeason.js'

export function createSeasonApi(client: HttpClient) {
  return {
    getById(id: string): Promise<Season> {
      return client.get<SeasonJson>(`/seasons/${id}`).then(mapSeason)
    },
    getList(): Promise<Season[]> {
      return client.get<SeasonJson[]>('/seasons').then((data) => data.map(mapSeason))
    },
    getUsersInSeason(seasonId: string): Promise<UserSeason[]> {
      return client.get<UserSeasonJson[]>(`/seasons/${seasonId}/users`).then((data) => data.map(mapUserSeason))
    },
    setUser(seasonId: string, userId: string, membership: Omit<UserSeasonSchemaInput, 'seasonId'> = {}): Promise<void> {
      return client.put(`/seasons/${seasonId}/users/${userId}`, membership)
    },
    removeUser(seasonId: string, userId: string): Promise<void> {
      return client.delete(`/seasons/${seasonId}/users/${userId}`)
    },
  }
}

export type SeasonApi = ReturnType<typeof createSeasonApi>
