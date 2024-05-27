import mapper from '@kitbag/mapper'
import { Player, PlayerCheckInRequest, PlayerRequest, PlayerResponse } from '@/models'
import { Api } from '@/services'

export class PlayerApi extends Api {
  public getById(id: string): Promise<Player> {
    return this.get<PlayerResponse>(`/players-get-by-id/${id}`)
      .then(({ data }) => mapper.map('PlayerResponse', data, 'Player'))
  }

  public getList(seasonId: string): Promise<Player[]> {
    return this.get<PlayerResponse[]>(`/players-get-list/${seasonId}`)
      .then(({ data }) => mapper.mapMany('PlayerResponse', data, 'Player'))
  }

  public create(request: PlayerRequest): Promise<string> {
    return this.post<string>('players-create', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: Partial<PlayerRequest>): Promise<string> {
    return this.put<string>(`players-update/${id}`, request)
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`players-remove/${id}`)
      .then(({ data }) => data)
  }

  public checkin(id: string, request: Partial<PlayerCheckInRequest>): Promise<string> {
    return this.put<string>(`players-checkin/${id}`, request)
      .then(({ data }) => data)
  }
}
