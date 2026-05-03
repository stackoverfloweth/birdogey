import type { User } from '../models/index.js'
import type { HttpClient } from './httpClient.js'
import type { UserAuthJson } from './types.js'
import { mapUserAuth } from './mappers.js'

export function createAuthApi(client: HttpClient) {
  return {
    sendCode(phoneNumber: string): Promise<void> {
      return client.post('/auth/send-code', { phoneNumber })
    },
    verifyCode(phoneNumber: string, code: string): Promise<User> {
      return client.post<UserAuthJson>('/auth/verify-code', { phoneNumber, code }).then(mapUserAuth)
    },
    refresh(): Promise<User> {
      return client.post<UserAuthJson>('/auth/refresh').then(mapUserAuth)
    },
    exchange(refreshToken: string): Promise<User> {
      return client.post<UserAuthJson>('/auth/exchange', { refreshToken }).then(mapUserAuth)
    },
    verifyRecaptcha(recaptchaToken: string, key: string): Promise<void> {
      return client.post('/recaptcha/verify', { recaptchaToken, key })
    },
  }
}

export type AuthApi = ReturnType<typeof createAuthApi>
