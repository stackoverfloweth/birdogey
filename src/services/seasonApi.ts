import { Api } from '@/services/api'

export class SeasonApi extends Api {
  public getList(): Promise<void> {
    return this.get('/seasons-get-list')
  }
}
