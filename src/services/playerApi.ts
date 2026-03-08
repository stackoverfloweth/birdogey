import mapper from '@kitbag/mapper'
import { Player, PlayerCheckInRequest, PlayerRequest, PlayerResponse, PlayerSignupRequest } from '@/models'
import { Api } from '@/services'

export class PlayerApi extends Api {
  protected routePrefix = '/players'

  public getById(id: string): Promise<Player> {
    return this.get<PlayerResponse>(`/${id}`)
      .then(({ data }) => mapper.map('PlayerResponse', data, 'Player'))
  }

  public getList(seasonId: string): Promise<Player[]> {
    return this.get<PlayerResponse[]>(`?seasonId=${seasonId}`)
      .then(({ data }) => mapper.mapMany('PlayerResponse', data, 'Player'))
  }

  public create(request: PlayerRequest): Promise<string> {
    return this.post<string>('/', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: Partial<PlayerRequest>): Promise<string> {
    return this.put<string>(`/${id}`, request)
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`/${id}`)
      .then(({ data }) => data)
  }

  public checkin(id: string, request: Partial<PlayerCheckInRequest>): Promise<string> {
    return this.put<string>(`/${id}/checkin`, request)
      .then(({ data }) => data)
  }

  public signup(request: PlayerSignupRequest): Promise<string> {
    return this.post<string>('/signup', request)
      .then(({ data }) => data)
  }
}
