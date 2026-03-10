import type { Event } from '../models'
import type { EventRequest } from '../models/api'
import type { HttpClient } from './httpClient'
import type { EventJson } from './types'
import { mapEvent } from './mappers'

export function createEventApi(client: HttpClient) {
  return {
    getById(id: string): Promise<Event> {
      return client.get<EventJson>(`/events/${id}`).then(mapEvent)
    },
    getList(seasonId: string): Promise<Event[]> {
      return client.get<EventJson[]>('/events', { seasonId }).then((data) => data.map(mapEvent))
    },
    create(request: EventRequest): Promise<string> {
      return client.post<string>('/events', request)
    },
    update(id: string, request: Partial<EventRequest>): Promise<string> {
      return client.put<string>(`/events/${id}`, request)
    },
    complete(id: string, request: Partial<EventRequest>): Promise<string> {
      return client.put<string>(`/events/${id}/complete`, request)
    },
    remove(id: string): Promise<string> {
      return client.delete<string>(`/events/${id}`)
    },
  }
}

export type EventApi = ReturnType<typeof createEventApi>
