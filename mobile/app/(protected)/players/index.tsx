import { PlayerListItem } from '@/components/PlayerListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl, ViewToken } from 'react-native'
import { Link, router } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { colors } from '@/theme/colors'
import { TextInput } from '@/components/TextInput'

export default function Players(): React.ReactNode {
  const api = useApiClient()
  const [playerSearch, setPlayerSearch] = useState('')

  const { data: players = [], refetch, isFetching } = useQuery({
    queryKey: ['players'],
    queryFn: () => api.user.getList(),
  })

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleIds(new Set(viewableItems.map((item) => item.item.id)))
  }, [])

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => player.name.toLowerCase().includes(playerSearch.toLowerCase()))
  }, [players, playerSearch])

  return (
    <View style={styles.container}>
      <View style={[formStyles.formGroup, { flexDirection: 'row', gap: 24 }]}>
        <TextInput
          style={[formStyles.input, { flexGrow: 1 }]}
          placeholder="Search players"
          value={playerSearch}
          onChangeText={setPlayerSearch}
          icon={<SymbolView name="magnifyingglass" size={20} tintColor={colors.primary} />}
        />
      </View>

      <FlatList
        style={styles.flatList}
        data={filteredPlayers}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/players/${item.id}`}>
            <PlayerListItem player={item} visible={visibleIds.has(item.id)} />
          </Link>
        )}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => void refetch()} />}
      />

      <Pressable style={formStyles.button} onPress={() => router.push('players/create')}>
        <SymbolView name="plus" size={24} tintColor="#fff" weight="bold" />
        <Text style={formStyles.buttonText}>Add Player</Text>
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
  },
})
