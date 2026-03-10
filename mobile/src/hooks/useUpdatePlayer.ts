import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPlayerApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useUpdatePlayer(seasonId: string) {
  const { apiClient } = useAuth()
  const playerApi = createPlayerApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      playerId: string,
      name?: string,
      tagId?: number,
      entryPaid?: boolean,
      udiscId?: string,
      imageUrl?: string,
    }) => {
      const { playerId, ...rest } = data
      return playerApi.update(playerId, { seasonId, ...rest })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all(seasonId) })
    },
  })
}
