import { EventListItem } from '@/components/EventListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '@/contexts/AuthContext'

export default function Events(): React.ReactNode {
  const api = useApiClient()
  const auth = useAuth()

  const { data: events = [], refetch, isRefetching } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.event.getList(auth.user?.seasons.map((season) => season.id) ?? []),
  })

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={events}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventListItem event={item} />
        )}
        keyExtractor={(item) => item.id}
        viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
      />

      <Pressable style={formStyles.button} onPress={() => router.push('events/create')}>
        <SymbolView name="plus" size={24} tintColor="#fff" weight="bold" />
        <Text style={formStyles.buttonText}>Add Event</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  flatList: {
    flex: 1,
  },
  list: {
    gap: 12,
    paddingBottom: 80,
  },
})
