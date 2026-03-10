import { View, FlatList, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEvents } from '../../../src/hooks/useEvents';
import { EventListItem } from '../../../src/components/EventListItem';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorView } from '../../../src/components/ErrorView';

export default function EventsListScreen() {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>();
  const { data: events, isLoading, error, refetch } = useEvents(seasonId!);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView message="Failed to load events" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(e) => e.id}
        renderItem={({ item }) => (
          <EventListItem
            event={item}
            onPress={() => router.push(`/(protected)/${seasonId}/events/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.empty}>No events yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
    fontSize: 16,
  },
});
