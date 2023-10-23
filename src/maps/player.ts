import { Player } from '@/models'
import { PlayerResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapPlayerResponseToPlayer: MapFunction<PlayerResponse, Player> = function(source) {
  return {
    ...source,
    id: this.map('ObjectId', source._id, 'string'),
    seasonId: this.map('ObjectId', source.seasonId, 'string'),
  }
}