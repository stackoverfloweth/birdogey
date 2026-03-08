import mapper from '@kitbag/mapper'
import { Event, EventRequest, EventResponse } from '@/models'
import { Api } from '@/services'

export class EventApi extends Api {
  protected routePrefix = '/events'

  public getById(id: string): Promise<Event> {
    return this.get<EventResponse>(`/${id}`)
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public getList(seasonId: string): Promise<Event[]> {
    return this.get<EventResponse[]>(`?seasonId=${seasonId}`)
      .then(({ data }) => mapper.mapMany('EventResponse', data, 'Event'))
  }

  public create(request: EventRequest): Promise<string> {
    return this.post<string>('/', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: Partial<EventRequest>): Promise<string> {
    return this.put<string>(`/${id}`, request)
      .then(({ data }) => data)
  }

  public complete(id: string, request: Partial<EventRequest>): Promise<string> {
    return this.put<string>(`/${id}/complete`, request)
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`/${id}`)
      .then(({ data }) => data)
  }
}
