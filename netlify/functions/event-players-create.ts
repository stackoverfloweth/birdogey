import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { Api, env, getClient, isValidRequest } from '../utilities'
import { EventPlayerRequest, EventPlayerResponse, PlayerResponse, EventResponse } from '@/models'

export const handler: Handler = Api('POST', 'event-players-create', (args, body) => async () => {
  if (!isValidRequest<EventPlayerRequest>(body, [
    ['playerId', 'string'],
    ['eventId', 'string'],
  ])) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventPlayerResponse>('event-players')

    const seasonId = await getSeason(db, body.eventId)
    const mostRecentEvent = await getMostRecentEvent(db, body.playerId)

    let incomingTagId = mostRecentEvent?.outgoingTagId
    if (!incomingTagId) {
      incomingTagId = await getNextAvailableTag(db, seasonId)
    }

    const result = await collection.insertOne({
      _id: new ObjectId(),
      incomingTagId,
      playerId: body.playerId,
      eventId: body.eventId,
      inForCtp: body.inForCtp ?? false,
      inForAce: body.inForAce ?? false,
      score: body.score,
      outgoingTagId: body.outgoingTagId,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})

async function getSeason(db: Db, eventId: string): Promise<string> {
  const collection = db.collection<EventResponse>('events')

  const event = await collection.findOne({ _id: new ObjectId(eventId) })

  if (!event?.seasonId) {
    throw `No Season found for event ${eventId}`
  }

  return event.seasonId
}

async function getMostRecentEvent(db: Db, playerId: string): Promise<EventPlayerResponse | undefined> {
  const collection = db.collection<EventPlayerResponse>('event-players')

  const [lastEvent] = await collection.aggregate([
    { $match: { playerId } },
    {
      $addFields: {
        eventIdObjectId: { $toObjectId: '$eventId' },
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'eventIdObjectId',
        foreignField: '_id',
        as: 'event',
      },
    },
    {
      $addFields: {
        event: { $first: '$event' },
      },
    },
    {
      $addFields: {
        completed: '$event.completed',
      },
    },
    { $match: { completed: { $exists: true } } },
    { $sort: { completed: -1 } },
    { $limit: 1 },
  ]).toArray()

  return lastEvent as EventPlayerResponse | undefined
}

function getNextAvailableTag(db: Db, seasonId: string): Promise<number> {
  const collection = db.collection<PlayerResponse>('players')

  return collection.countDocuments({ seasonId })
}