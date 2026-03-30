import { MINUTE } from '@birdogey/shared'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MINUTE * 5,
      retry: 1,
    },
  },
})
