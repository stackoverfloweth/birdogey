import { InjectionKey } from 'vue'
import { ApiConfig } from '@/services/api'
import { ExampleApi } from '@/services/exampleApi'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: ApiConfig) {
  return {
    example: new ExampleApi(config),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')