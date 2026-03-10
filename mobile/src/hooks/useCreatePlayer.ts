import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlayerApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCreatePlayer(seasonId: string) {
  const { apiClient } = useAuth()
  const playerApi = createPlayerApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string, tagId?: number, entryPaid?: boolean, udiscId?: string }) => playerApi.create({ seasonId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all(seasonId) })
    },
  })
}
