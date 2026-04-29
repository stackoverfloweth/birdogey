import { useAuth } from '@/contexts/AuthContext'
import { Season } from '@birdogey/shared'

export function useAuthSeasons(): Season[] {
  const auth = useAuth()

  return auth.user?.seasons ?? []
}
