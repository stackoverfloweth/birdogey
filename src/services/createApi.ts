import { createActions } from '@prefecthq/vue-compositions'
import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { SeasonApi } from '@/services/seasonApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    seasons: createActions(new SeasonApi(config)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')