import { Event } from '@/models'
import { EventResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapEventResponseToEvent: MapFunction<EventResponse, Event> = function(source) {
  return {
    ...source,
    id: this.map('ObjectId', source._id, 'string'),
    seasonId: this.map('ObjectId', source.seasonId, 'string'),
    players: this.map('EventPlayerResponse', source.players, 'EventPlayer'),
    ctpPlayerIds: this.map('ObjectId', source.ctpPlayerIds, 'string'),
    acePlayerIds: this.map('ObjectId', source.acePlayerIds, 'string'),
  }
}