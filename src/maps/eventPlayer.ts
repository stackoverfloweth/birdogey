import { EventPlayer } from '@/models'
import { EventPlayerResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapEventPlayerResponseToEventPlayer: MapFunction<EventPlayerResponse, EventPlayer> = function(source) {
  return {
    ...source,
    id: this.map('ObjectId', source._id, 'string'),
    playerId: this.map('ObjectId', source.playerId, 'string'),
  }
}