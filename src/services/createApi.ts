import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { EventApi } from '@/services/eventApi'
import { PlayerApi } from '@/services/playerApi'
import { UserApi } from '@/services/userApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    events: createActions(new EventApi(config)),
    players: createActions(new PlayerApi(config)),
    users: createActions(new UserApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')