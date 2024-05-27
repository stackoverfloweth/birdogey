import mapper, { Profile } from '@kitbag/mapper'
import { EventPlayer } from '@/models'
import { EventPlayerResponse } from '@/models/api'

export const mapEventPlayerResponseToEventPlayer = {
  sourceKey: 'EventPlayerResponse',
  destinationKey: 'EventPlayer',
  map: (source: EventPlayerResponse): EventPlayer => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      playerId: mapper.map('ObjectId', source.playerId, 'string'),
    }
  },
} as const satisfies Profile