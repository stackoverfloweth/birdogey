import mapper, { Profile } from '@kitbag/mapper'
import { Event } from '@/models'
import { EventResponse } from '@/models/api'

export const mapEventResponseToEvent = {
  sourceKey: 'EventResponse',
  destinationKey: 'Event',
  map: function(source: EventResponse): Event {
    return {
      ...source,
      id: mapper.map('ObjectId', source._id, 'string'),
      seasonId: mapper.map('ObjectId', source.seasonId, 'string'),
      players: mapper.mapMany('EventPlayerResponse', source.players, 'EventPlayer'),
      ctpPlayerIds: mapper.mapMany('ObjectId', source.ctpPlayerIds, 'string'),
      acePlayerIds: mapper.mapMany('ObjectId', source.acePlayerIds, 'string'),
    }
  },
} as const satisfies Profile