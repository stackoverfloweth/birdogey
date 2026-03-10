import type { HttpClient } from './httpClient'
import type { ImageKitAuthJson } from './types'

export function createImageKitApi(client: HttpClient) {
  return {
    authenticate(): Promise<ImageKitAuthJson> {
      return client.get<ImageKitAuthJson>('/imagekit/auth')
    },
  }
}

export type ImageKitApi = ReturnType<typeof createImageKitApi>
