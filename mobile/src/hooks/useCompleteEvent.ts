import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCompleteEvent(seasonId: string, eventId: string) {
  const { apiClient } = useAuth()
  const eventApi = createEventApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => eventApi.complete(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all(seasonId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) })
    },
  })
}
