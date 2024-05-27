import { Profile } from '@kitbag/mapper'
import { ObjectId } from 'mongodb'

export const mapObjectIdToString = {
  sourceKey: 'ObjectId',
  destinationKey: 'string',
  map: function(source: ObjectId): string {
    return source.toString()
  },
} as const satisfies Profile