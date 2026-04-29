import { useAuth } from '@/contexts/AuthContext'
import { Season } from '@birdogey/shared'

export function useSeason(seasonId: string): Season | undefined {
  const auth = useAuth()

  return auth.user?.seasons.find((season) => season.id === seasonId)
}
