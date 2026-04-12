import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCheckIn(eventId: string) {
  const { apiClient } = useAuth()
  const userApi = createUserApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string, tagId: number, udiscId?: string }) => userApi.checkin(data.userId, { eventId, tagId: data.tagId, udiscId: data.udiscId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) })
    },
  })
}
