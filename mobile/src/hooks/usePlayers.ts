import { useQuery } from '@tanstack/react-query'
import { createPlayerApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function usePlayersBySeason(seasonId: string) {
  const { apiClient } = useAuth()
  const playerApi = createPlayerApi(apiClient)

  return useQuery({
    queryKey: queryKeys.players.all(seasonId),
    queryFn: () => playerApi.getList(seasonId),
    enabled: !!seasonId,
  })
}
