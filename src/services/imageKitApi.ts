import { ImageKitAuthResponse } from '@/models/api'
import { Api } from '@/services'

export class ImageKitApi extends Api {
  public authenticate(): Promise<ImageKitAuthResponse> {
    return this.get<ImageKitAuthResponse>('/imagekit-auth')
      .then(({ data }) => data)
  }
}
