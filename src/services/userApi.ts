import { User, UserAuthResponse } from '@/models'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class UserApi extends Api {
  public attemptLogin(password: string): Promise<User | undefined> {
    return this.post<UserAuthResponse>('users-attempt-login', { password })
      .then(({ data }) => mapper.map('UserAuthResponse', data, 'User'))
  }
}