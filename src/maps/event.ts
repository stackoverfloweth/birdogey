import { Event } from '@/models'
import { EventResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapEventResponseToEvent: MapFunction<EventResponse, Event> = function(source) {
  return {
    id: source._id.toString(),
    ...source,
  }
}