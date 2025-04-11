import mapper from '@kitbag/mapper'
import { User, UserAuthResponse } from '@/models'
import { Api } from '@/services'

export class UserApi extends Api {
  public attemptLogin(password: string): Promise<User | undefined> {
    return this.post<UserAuthResponse>('users-attempt-login', { password })
      .then(({ data }) => mapper.map('UserAuthResponse', data, 'User'))
  }

  public refreshLogin(): Promise<User> {
    return this.post<UserAuthResponse>('users-refresh-login')
      .then(({ data }) => mapper.map('UserAuthResponse', data, 'User'))
  }
}
