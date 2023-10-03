import { apiKey, CreateApi } from '@/services/createApi'
import { inject } from '@/utilities'

export function useApi(): CreateApi {
  return inject(apiKey)
}