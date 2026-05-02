import { NextEventCard } from '@/components/NextEventCard'
import { UserSeasonCard } from '@/components/UserSeasonCard'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { ScrollView, StyleSheet } from 'react-native'

export default function ProtectedIndex(): React.ReactNode {
  const api = useApiClient()

  const { data: nextEvent } = useQuery({
    queryKey: ['events', 'next'],
    queryFn: () => api.event.getNext(),
  })

  const { data: seasons = [] } = useQuery({
    queryKey: ['players', 'seasons'],
    queryFn: () => api.user.getSeasonsForUser(),
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!!nextEvent && <NextEventCard event={nextEvent} />}
      {seasons.map((season) => (
        <UserSeasonCard key={season.seasonId} userSeason={season} />
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
