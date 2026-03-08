import { ImageKitAuthResponse } from '@/models/api'
import { Api } from '@/services'

export class ImageKitApi extends Api {
  protected routePrefix = '/imagekit'

  public authenticate(): Promise<ImageKitAuthResponse> {
    return this.get<ImageKitAuthResponse>('/auth')
      .then(({ data }) => data)
  }
}
