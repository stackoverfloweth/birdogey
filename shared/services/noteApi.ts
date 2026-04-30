import type { HttpClient } from './httpClient.js'
import type { NoteJson } from './types.js'
import { mapNote } from './mappers.js'
import { Note } from '../models/index.js'
import { NoteRequest } from '../models/api/index.js'

export function createNoteApi(client: HttpClient) {
  return {
    listForUser(userId: string): Promise<Note[]> {
      return client.get<NoteJson[]>(`/notes/user/${userId}`).then((data) => data.map(mapNote))
    },
    create(userId: string, request: NoteRequest): Promise<string> {
      return client.post<string>(`/notes/user/${userId}`, request)
    },
    update(id: string, request: NoteRequest): Promise<string> {
      return client.put<string>(`/notes/${id}`, request)
    },
    remove(id: string): Promise<string> {
      return client.delete<string>(`/notes/${id}`)
    },
  }
}

export type NoteApi = ReturnType<typeof createNoteApi>
