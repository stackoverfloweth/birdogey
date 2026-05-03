import type { HttpClient } from './httpClient.js'
import type { UserJson, UserSeasonJson } from './types.js'
import { mapUser, mapUserSeason } from './mappers.js'
import { User } from '../models/index.js'
import { UserSeason } from '../models/userSeason.js'
import { CheckInRequest, UserRequest, SignupRequest } from '../models/api/index.js'

export function createUserApi(client: HttpClient) {
  return {
    getById(id: string): Promise<User> {
      return client.get<UserJson>(`/users/${id}`).then(mapUser)
    },
    getList(seasonIds?: string[]): Promise<User[]> {
      const params = seasonIds?.length ? { seasonIds: seasonIds.join(',') } : undefined
      return client.get<UserJson[]>('/users', params).then((data) => data.map(mapUser))
    },
    getSeasonsForUser(): Promise<UserSeason[]> {
      return client.get<UserSeasonJson[]>('/users/seasons').then((data) => data.map(mapUserSeason))
    },
    getUsersInSeason(seasonId: string): Promise<UserSeason[]> {
      return client.get<UserSeasonJson[]>(`/users/seasons/${seasonId}`).then((data) => data.map(mapUserSeason))
    },
    create(request: UserRequest): Promise<string> {
      return client.post<string>('/users', request)
    },
    update(id: string, request: Partial<UserRequest>): Promise<string> {
      return client.put<string>(`/users/${id}`, request)
    },
    remove(id: string): Promise<string> {
      return client.delete<string>(`/users/${id}`)
    },
    checkin(id: string, request: Partial<CheckInRequest>): Promise<string> {
      return client.put<string>(`/users/${id}/checkin`, request)
    },
    signup(request: SignupRequest): Promise<string> {
      return client.post<string>('/users/signup', request)
    },
  }
}

export type UserApi = ReturnType<typeof createUserApi>
