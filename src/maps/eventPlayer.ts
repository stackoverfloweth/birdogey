import { EventPlayer } from '@/models'
import { EventPlayerResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapEventPlayerResponseToEventPlayer: MapFunction<EventPlayerResponse, EventPlayer> = function(source) {
  return {
    id: source._id.toString(),
    ...source,
  }
}