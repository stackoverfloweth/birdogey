import { PlayerSeasonResponse } from '@birdogey/shared/api'
import { Collection, ObjectId } from 'mongodb'

export function getNextAvailableTag(seasonId: string | ObjectId, collection: Collection<PlayerSeasonResponse>): Promise<number> {
  if (typeof seasonId === 'string') {
    return getNextAvailableTag(new ObjectId(seasonId), collection)
  }

  return collection.countDocuments({ seasonId }).then((count) => count + 1)
}
