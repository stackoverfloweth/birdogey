import { NextEventCard } from '@/components/NextEventCard'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { ScrollView, StyleSheet } from 'react-native'

export default function ProtectedIndex(): React.ReactNode {
  const api = useApiClient()

  const nextEvent = useQuery({
    queryKey: ['nextEvent'],
    queryFn: () => api.event.getList(),
    select: (events) => events.at(0),
  })

  return (
    <ScrollView style={styles.container}>
      {!!nextEvent.data && <NextEventCard event={nextEvent.data} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
})
