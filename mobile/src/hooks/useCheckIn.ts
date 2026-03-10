import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlayerApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCheckIn(eventId: string) {
  const { apiClient } = useAuth()
  const playerApi = createPlayerApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { playerId: string, tagId: number, udiscId?: string }) => playerApi.checkin(data.playerId, { eventId, tagId: data.tagId, udiscId: data.udiscId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) })
    },
  })
}
