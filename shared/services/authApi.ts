import type { User } from '../models'
import type { HttpClient } from './httpClient'
import type { UserAuthJson } from './types'
import { mapUser } from './mappers'

export function createAuthApi(client: HttpClient) {
  return {
    login(password: string): Promise<User> {
      return client.post<UserAuthJson>('/auth/login', { password }).then(mapUser)
    },
    refresh(): Promise<User> {
      return client.post<UserAuthJson>('/auth/refresh').then(mapUser)
    },
    verifyRecaptcha(recaptchaToken: string, key: string): Promise<void> {
      return client.post('/recaptcha/verify', { recaptchaToken, key })
    },
  }
}

export type AuthApi = ReturnType<typeof createAuthApi>
