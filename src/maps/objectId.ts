import { Profile } from '@stackoverfloweth/mapper'
import { ObjectId } from 'mongodb'

export const mapObjectIdToString = {
  sourceKey: 'ObjectId',
  destinationKey: 'string',
  map: (source: ObjectId): string => {
    return source.toString()
  },
} as const satisfies Profile