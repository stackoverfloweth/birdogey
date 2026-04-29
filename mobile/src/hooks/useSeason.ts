import { useAuth } from '@/contexts/AuthContext'
import { Season } from '@birdogey/shared'
import { useMemo } from 'react'

export function useSeason(seasonId: string): Season | undefined {
  const auth = useAuth()

  return useMemo(() => {
    return auth.user?.seasons.find((season) => season.id === seasonId)
  }, [auth.user?.seasons, seasonId])
}
