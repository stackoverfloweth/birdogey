import { useQuery } from '@tanstack/react-query'
import { createEventApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useEvent(eventId: string) {
  const { apiClient } = useAuth()
  const eventApi = createEventApi(apiClient)

  return useQuery({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: () => eventApi.getById(eventId),
    enabled: !!eventId,
  })
}
