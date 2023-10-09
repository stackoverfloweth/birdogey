import { Player } from '@/models'
import { PlayerResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapPlayerResponseToPlayer: MapFunction<PlayerResponse, Player> = function(source) {
  return {
    id: this.map('ObjectId', source._id, 'string'),
    ...source,
  }
}