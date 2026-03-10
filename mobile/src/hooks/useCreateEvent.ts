import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEventApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCreateEvent(seasonId: string) {
  const { apiClient } = useAuth()
  const eventApi = createEventApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string, notes?: string, ctpPerPlayer: number, acePerPlayer: number }) => eventApi.create({ seasonId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all(seasonId) })
    },
  })
}
