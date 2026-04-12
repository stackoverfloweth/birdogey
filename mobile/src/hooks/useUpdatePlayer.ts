import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useUpdateUser(seasonId: string) {
  const { apiClient } = useAuth()
  const userApi = createUserApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      userId: string,
      name?: string,
      tagId?: number,
      entryPaid?: boolean,
      udiscId?: string,
      imageUrl?: string,
    }) => {
      const { userId, ...rest } = data
      return userApi.update(userId, { seasonId, ...rest })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all(seasonId) })
    },
  })
}
