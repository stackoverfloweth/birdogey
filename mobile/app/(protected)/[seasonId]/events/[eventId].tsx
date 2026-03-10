import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEvent } from '../../../../src/hooks/useEvent';
import { LoadingSpinner } from '../../../../src/components/LoadingSpinner';
import { ErrorView } from '../../../../src/components/ErrorView';
import { calculateEventCtpPot, calculateEventAcePot } from '../../../../src/services/eventBalance';

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { data: event, isLoading, error, refetch } = useEvent(eventId!);

  if (isLoading) return <LoadingSpinner />;
  if (error || !event) return <ErrorView message="Failed to load event" onRetry={refetch} />;

  const ctpPot = calculateEventCtpPot(event);
  const acePot = calculateEventAcePot(event);
  const isCompleted = !!event.completed;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      {event.notes ? <Text style={styles.notes}>{event.notes}</Text> : null}

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>${ctpPot}</Text>
          <Text style={styles.statLabel}>CTP Pot</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>${acePot}</Text>
          <Text style={styles.statLabel}>Ace Pot</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{event.players.length}</Text>
          <Text style={styles.statLabel}>Players</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {isCompleted ? 'Results' : 'Checked In'}
      </Text>
      {event.players.map((ep) => (
        <View key={ep.id} style={styles.playerRow}>
          <Text style={styles.playerTag}>#{ep.incomingTagId}</Text>
          <Text style={styles.playerId}>{ep.playerId}</Text>
          {ep.score !== undefined && <Text style={styles.score}>{ep.score}</Text>}
          {ep.outgoingTagId !== undefined && (
            <Text style={styles.outTag}>→ #{ep.outgoingTagId}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    gap: 10,
  },
  playerTag: {
    fontWeight: '600',
    fontSize: 14,
  },
  playerId: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
  },
  outTag: {
    fontSize: 13,
    color: '#6b7280',
  },
});
