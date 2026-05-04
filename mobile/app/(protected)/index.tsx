import { NextEventCard } from '@/components/NextEventCard'
import { PlayerSeasonCard } from '@/components/PlayerSeasonCard'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useAuth } from '@/contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { ScrollView, StyleSheet } from 'react-native'

export default function ProtectedIndex(): React.ReactNode {
  const api = useApiClient()
  const auth = useAuth()

  const { data: nextEvent } = useQuery({
    queryKey: ['events', 'next'],
    queryFn: () => api.event.getNext(),
  })

  const { data: seasons = [] } = useQuery({
    queryKey: ['players', auth.user?.id, 'seasons'],
    queryFn: () => api.user.getSeasonsForUser(auth.user?.id ?? ''),
    enabled: !!auth.user?.id,
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!!nextEvent && <NextEventCard event={nextEvent} />}
      {seasons.map((season) => (
        <PlayerSeasonCard key={season.seasonId} userSeason={season} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
})
