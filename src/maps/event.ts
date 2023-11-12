import { Profile } from '@stackoverfloweth/mapper'
import { Event } from '@/models'
import { EventResponse } from '@/models/api'
import { mapper } from '@/services'

export const mapEventResponseToEvent = {
  sourceKey: 'EventResponse',
  destinationKey: 'Event',
  map: (source: EventResponse): Event => {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      seasonId: mapper.map('ObjectId', source.seasonId, 'string'),
      players: mapper.map('EventPlayerResponse', source.players, 'EventPlayer'),
      ctpPlayerIds: mapper.map('ObjectId', source.ctpPlayerIds, 'string'),
      acePlayerIds: mapper.map('ObjectId', source.acePlayerIds, 'string'),
    }
  },
} as const satisfies Profile