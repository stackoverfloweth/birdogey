import mapper, { Profile } from '@kitbag/mapper'
import { Player } from '@/models'
import { PlayerResponse } from '@/models/api'

export const mapPlayerResponseToPlayer = {
  sourceKey: 'PlayerResponse',
  destinationKey: 'Player',
  map: (source: PlayerResponse): Player => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      seasonId: mapper.map('ObjectId', source.seasonId, 'string'),
    }
  },
} as const satisfies Profile
