import { EventPlayer, EventPlayerRequest, EventPlayerResponse } from '@/models'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class EventPlayerApi extends Api {
  public getById(id: string): Promise<void> {
    return this.get(`/event-players-get-by-id/${id}`)
  }

  public getList(eventId: string): Promise<EventPlayer[]> {
    return this.get<EventPlayerResponse[]>(`/event-players-get-list/${eventId}`)
      .then(({ data }) => mapper.map('EventPlayerResponse', data, 'EventPlayer'))
  }

  public create(request: EventPlayerRequest): Promise<string> {
    return this.post<string>('event-players-create', request)
      .then(({ data }) => data)
  }

  public update(id: string, request: Partial<EventPlayerRequest>): Promise<string> {
    return this.put<string>(`event-players-update/${id}`, request)
      .then(({ data }) => data)
  }

  public remove(id: string): Promise<string> {
    return this.delete<string>(`event-players-remove/${id}`)
      .then(({ data }) => data)
  }
}
