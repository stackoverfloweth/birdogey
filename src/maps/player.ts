import { Profile } from '@stackoverfloweth/mapper'
import { Player } from '@/models'
import { PlayerResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapPlayerResponseToPlayer = {
  sourceKey: 'PlayerResponse',
  destinationKey: 'Player',
  map: (source) => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      seasonId: mapper.map('ObjectId', source.seasonId, 'string'),
    }
  },
} as const satisfies Profile<'PlayerResponse', PlayerResponse, 'Player', Player>
