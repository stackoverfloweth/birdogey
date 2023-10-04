import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { CourseApi } from '@/services/courseApi'
import { EventApi } from '@/services/eventApi'
import { EventPlayerApi } from '@/services/eventPlayerApi'
import { PlayerApi } from '@/services/playerApi'
import { SeasonApi } from '@/services/seasonApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    courses: createActions(new CourseApi(config)),
    events: createActions(new EventApi(config)),
    eventPlayers: createActions(new EventPlayerApi(config)),
    players: createActions(new PlayerApi(config)),
    seasons: createActions(new SeasonApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')