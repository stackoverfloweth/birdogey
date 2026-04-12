import { useQuery } from '@tanstack/react-query'
import { createUserApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useUsersBySeason(seasonId: string) {
  const { apiClient } = useAuth()
  const userApi = createUserApi(apiClient)

  return useQuery({
    queryKey: queryKeys.users.all(seasonId),
    queryFn: () => userApi.getList(seasonId),
    enabled: !!seasonId,
  })
}
