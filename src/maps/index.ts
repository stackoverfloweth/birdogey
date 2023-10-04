import { mapCourseResponseToCourse } from '@/maps/course'
import { mapEventResponseToEvent } from '@/maps/event'
import { mapEventPlayerResponseToEventPlayer } from '@/maps/eventPlayer'
import { mapPlayerResponseToPlayer } from '@/maps/player'
import { mapSeasonResponseToSeason } from '@/maps/season'

export const maps = {
  CourseResponse: { Course: mapCourseResponseToCourse },
  EventResponse: { Event: mapEventResponseToEvent },
  EventPlayerResponse: { EventPlayer: mapEventPlayerResponseToEventPlayer },
  PlayerResponse: { Player: mapPlayerResponseToPlayer },
  SeasonResponse: { Season: mapSeasonResponseToSeason },
}