import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUserApi } from '@birdogey/shared'
import { useAuth } from '../contexts/AuthContext'
import { queryKeys } from './queryKeys'

export function useCreateUser(seasonId: string) {
  const { apiClient } = useAuth()
  const userApi = createUserApi(apiClient)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string, tagId?: number, entryPaid?: boolean, udiscId?: string }) => userApi.create({ seasonId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all(seasonId) })
    },
  })
}
