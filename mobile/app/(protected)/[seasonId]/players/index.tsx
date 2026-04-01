import { View, FlatList, Text, StyleSheet } from 'react-native'
import { useGlobalSearchParams } from 'expo-router'
import { usePlayersBySeason } from '@/hooks/usePlayers'
import { PlayerListItem } from '@/components/PlayerListItem'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorView } from '@/components/ErrorView'

export default function PlayersListScreen(): React.ReactNode {
  const { seasonId } = useGlobalSearchParams<{ seasonId: string }>()
  const { data: players, isLoading, error, refetch } = usePlayersBySeason(seasonId)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorView message="Failed to load players" onRetry={() => void refetch()} />

  return (
    <View style={styles.container}>
      <FlatList
        data={players}
        keyExtractor={(player) => player.id}
        renderItem={({ item }) => <PlayerListItem player={item} />}
        contentContainerStyle={styles.list}
        onRefresh={() => void refetch()}
        refreshing={isLoading}
        ListEmptyComponent={<Text style={styles.empty}>No players yet</Text>}
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
