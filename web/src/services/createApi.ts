import { createActions } from '@prefecthq/vue-compositions'
import { showToast } from '@prefecthq/prefect-design'
import { InjectionKey } from 'vue'
import { FetchHttpClient, HttpClientConfig, createEventApi, createUserApi, createAuthApi, createImageKitApi } from '@birdogey/shared'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createApi(config: HttpClientConfig) {
  const client = new FetchHttpClient({
    ...config,
    onError: (error) => {
      if (error instanceof Error) {
        showToast(error.message, 'error')
      }
    },
  })

  return {
    events: createActions(createEventApi(client)),
    users: createActions(createUserApi(client)),
    auth: createActions(createAuthApi(client)),
    imagekit: createActions(createImageKitApi(client)),
  }
}

export type CreateApi = ReturnType<typeof createApi>

export const apiKey: InjectionKey<CreateApi> = Symbol('ApiKey')
