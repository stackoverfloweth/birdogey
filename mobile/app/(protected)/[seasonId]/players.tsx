import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePlayersBySeason } from '../../../src/hooks/usePlayers';
import { PlayerListItem } from '../../../src/components/PlayerListItem';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorView } from '../../../src/components/ErrorView';

export default function PlayersListScreen() {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>();
  const { data: players, isLoading, error, refetch } = usePlayersBySeason(seasonId!);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView message="Failed to load players" onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Players</Text>
      <FlatList
        data={players}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <PlayerListItem player={item} />}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.empty}>No players yet</Text>}
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
