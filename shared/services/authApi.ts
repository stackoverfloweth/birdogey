import type { User } from '../models'
import type { HttpClient } from './httpClient'
import type { UserAuthJson } from './types'
import { mapUser } from './mappers'

export function createAuthApi(client: HttpClient) {
  return {
    sendCode(phoneNumber: string): Promise<void> {
      return client.post('/auth/send-code', { phoneNumber })
    },
    verifyCode(phoneNumber: string, code: string): Promise<User> {
      return client.post<UserAuthJson>('/auth/verify-code', { phoneNumber, code }).then(mapUser)
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
