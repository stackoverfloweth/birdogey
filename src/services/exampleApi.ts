import { Api } from '@/services/api'

export class ExampleApi extends Api {
  public ping(): Promise<void> {
    return this.get('/hello-world')
  }
}
