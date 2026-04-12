import type { HttpClient } from './httpClient'
import type { UserJson, UserSeasonJson } from './types'
import { mapUser, mapUserSeason } from './mappers'
import { User } from '../models'
import { UserSeason } from '../models/userSeason'
import { CheckInRequest, UserRequest, SignupRequest } from '../models/api'

export function createUserApi(client: HttpClient) {
  return {
    getById(id: string): Promise<User> {
      return client.get<UserJson>(`/users/${id}`).then(mapUser)
    },
    getList(seasonIds: string[] = []): Promise<User[]> {
      return client.get<UserJson[]>('/users', { seasonIds: seasonIds.join(',') }).then((data) => data.map(mapUser))
    },
    getSeasonList(seasonId: string): Promise<UserSeason[]> {
      return client.get<UserSeasonJson[]>(`/users/season/${seasonId}`).then((data) => data.map(mapUserSeason))
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
