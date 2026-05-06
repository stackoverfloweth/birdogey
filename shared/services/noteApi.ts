import type { HttpClient } from './httpClient.js'
import type { NoteJson } from './types.js'
import { mapNote } from './mappers.js'
import { Note } from '../models/index.js'
import { NoteRequest } from '../models/api/index.js'

export function createNoteApi(client: HttpClient) {
  return {
    getForUser(userId: string): Promise<Note | null> {
      return client.get<NoteJson | null>(`/notes/user/${userId}`).then((data) => {
        return data ? mapNote(data) : null
      })
    },
    upsertForUser(userId: string, request: NoteRequest): Promise<string> {
      return client.put<string>(`/notes/user/${userId}`, request)
    },
  }
}

export type NoteApi = ReturnType<typeof createNoteApi>
