import { EventListItem } from '@/components/EventListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl } from 'react-native'
import { router } from 'expo-router'

export default function Events(): React.ReactNode {
  const api = useApiClient()

  const { data: events = [], refetch, isFetching } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.event.getList(),
  })

  return (
    <View style={styles.container}>
      <Pressable style={formStyles.button} onPress={() => router.push('events/create')}>
        <SymbolView name="plus" size={24} tintColor="#fff" weight="bold" />
        <Text style={formStyles.buttonText}>Add Event</Text>
      </Pressable>

      <FlatList
        data={events}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventListItem event={item} />
        )}
        keyExtractor={(item) => item.id}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => void refetch()} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  list: {
    gap: 16,
  },
})
