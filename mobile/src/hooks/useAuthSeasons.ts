import { useAuth } from '@/contexts/AuthContext'
import { Season } from '@birdogey/shared'
import { useMemo } from 'react'

export function useAuthSeasons(): Season[] {
  const auth = useAuth()

  return useMemo(() => auth.user?.seasons ?? [], [auth.user?.seasons])
}
