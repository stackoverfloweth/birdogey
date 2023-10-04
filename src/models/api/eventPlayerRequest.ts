import { EventPlayerResponse } from '@/models/api/eventPlayerResponse'

export type EventPlayerRequest = Omit<EventPlayerResponse, '_id'>