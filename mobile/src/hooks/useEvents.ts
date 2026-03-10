import { useQuery } from '@tanstack/react-query'
import { createEventApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useEvents(seasonId: string) {
  const { apiClient } = useAuth()
  const eventApi = createEventApi(apiClient)

  return useQuery({
    queryKey: queryKeys.events.all(seasonId),
    queryFn: () => eventApi.getList(seasonId),
    enabled: !!seasonId,
  })
}
