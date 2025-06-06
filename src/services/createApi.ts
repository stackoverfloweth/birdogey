import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig, EventApi, PlayerApi, UserApi } from '@/services'
import { ImageKitApi } from '@/services/imageKitApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    events: createActions(new EventApi(config)),
    players: createActions(new PlayerApi(config)),
    users: createActions(new UserApi(config)),
    imagekit: createActions(new ImageKitApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')
