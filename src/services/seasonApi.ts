import { Season, SeasonRequest, SeasonResponse } from '@/models'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class SeasonApi extends Api {
  public getById(id: string): Promise<void> {
    return this.get(`/seasons-get-by-id/${id}`)
  }

  public getList(): Promise<Season[]> {
    return this.get<SeasonResponse[]>('/seasons-get-list')
      .then(({ data }) => mapper.map('SeasonResponse', data, 'Season'))
  }

  public create(request: SeasonRequest): Promise<string> {
    return this.post<string>('seasons-create', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: SeasonRequest): Promise<string> {
    return this.put<string>('seasons-update', { id, ...request })
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`seasons-remove/${id}`)
      .then(({ data }) => data)
  }
}
