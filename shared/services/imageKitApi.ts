import type { HttpClient } from './httpClient.js'
import type { ImageKitAuthJson } from './types.js'

export function createImageKitApi(client: HttpClient) {
  return {
    authenticate(): Promise<ImageKitAuthJson> {
      return client.get<ImageKitAuthJson>('/imagekit/auth')
    },
  }
}

export type ImageKitApi = ReturnType<typeof createImageKitApi>
