import { EventResponse } from '@/models/api/eventResponse'

export type EventRequest = Omit<EventResponse, '_id'>