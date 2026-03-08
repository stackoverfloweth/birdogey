import { apiKey, CreateApi } from '@/services'
import { inject } from '@/utilities'

export function useApi(): CreateApi {
  return inject(apiKey)
}
