import { Event, EventRequest, EventResponse } from '@/models'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class EventApi extends Api {
  public getById(id: string): Promise<void> {
    return this.get(`/events-get-by-id/${id}`)
  }

  public getList(seasonId: string): Promise<Event[]> {
    return this.get<EventResponse[]>(`/events-get-list/${seasonId}`)
      .then(({ data }) => mapper.map('EventResponse', data, 'Event'))
  }

  public create(request: EventRequest): Promise<string> {
    return this.post<string>('events-create', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: Partial<EventRequest>): Promise<string> {
    return this.put<string>(`events-update/${id}`, request)
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`events-remove/${id}`)
      .then(({ data }) => data)
  }
}
