import { View, FlatList, Text, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useEvents } from '@/hooks/useEvents'
import { EventListItem } from '@/components/EventListItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorView } from '@/components/ErrorView'

export default function EventsListScreen(): React.ReactNode {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>()
  const { data: events, isLoading, error, refetch } = useEvents(seasonId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorView message="Failed to load events" onRetry={() => void refetch()} />

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(event) => event.id}
        renderItem={({ item }) => (
          <EventListItem
            event={item}
            onPress={() => router.push(`/(protected)/${seasonId}/events/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        onRefresh={() => void refetch()}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 16,
  },
})
