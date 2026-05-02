import { NextEventCard } from '@/components/NextEventCard'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { ScrollView, StyleSheet } from 'react-native'

export default function ProtectedIndex(): React.ReactNode {
  const api = useApiClient()

  const { data: nextEvent } = useQuery({
    queryKey: ['events', 'next'],
    queryFn: () => api.event.getNext(),
  })

  return (
    <ScrollView style={styles.container}>
      {!!nextEvent && <NextEventCard event={nextEvent} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
})
