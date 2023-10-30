import { mapCourseResponseToCourse } from '@/maps/course'
import { mapEventResponseToEvent } from '@/maps/event'
import { mapEventPlayerResponseToEventPlayer } from '@/maps/eventPlayer'
import { mapObjectIdToString } from '@/maps/objectId'
import { mapPlayerResponseToPlayer } from '@/maps/player'
import { mapSeasonResponseToSeason } from '@/maps/season'
import { mapUserAuthResponseToUser } from '@/maps/user'

export const maps = {
  ObjectId: { string: mapObjectIdToString },
  CourseResponse: { Course: mapCourseResponseToCourse },
  EventResponse: { Event: mapEventResponseToEvent },
  EventPlayerResponse: { EventPlayer: mapEventPlayerResponseToEventPlayer },
  PlayerResponse: { Player: mapPlayerResponseToPlayer },
  SeasonResponse: { Season: mapSeasonResponseToSeason },
  UserAuthResponse: { User: mapUserAuthResponseToUser },
}