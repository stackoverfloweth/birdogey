import { PlayerListItem } from '@/components/PlayerListItem'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useQuery } from '@tanstack/react-query'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'
import { StyleSheet, View, Text, FlatList, Pressable, RefreshControl, ViewToken } from 'react-native'
import { router } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { colors } from '@/theme/colors'
import { TextInput } from '@/components/TextInput'
import { badgeStyles } from '@/theme/badge'

export default function Players(): React.ReactNode {
  const api = useApiClient()
  const [playerSearch, setPlayerSearch] = useState('')
  const [filterSeasonIds, setFilterSeasonIds] = useState<string[]>([])

  const { data: players = [], refetch, isFetching } = useQuery({
    queryKey: ['players', filterSeasonIds],
    queryFn: () => api.user.getList(Array.from(filterSeasonIds)),
  })

  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => api.season.getList(),
  })

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleIds(new Set(viewableItems.map((item) => item.item.id)))
  }, [])

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => player.name.toLowerCase().includes(playerSearch.toLowerCase()))
  }, [players, playerSearch])

  function toggleSeason(seasonId: string): void {
    if (filterSeasonIds.includes(seasonId)) {
      setFilterSeasonIds((prev) => prev.filter((id) => id !== seasonId))
    } else {
      setFilterSeasonIds((prev) => [...prev, seasonId])
    }
  }

  return (
    <View style={styles.container}>
      <View style={[formStyles.formGroup, { flexDirection: 'row', gap: 24 }]}>
        <TextInput
          style={{ flexGrow: 1 }}
          placeholder="Search players"
          value={playerSearch}
          onChangeText={setPlayerSearch}
          clearButtonMode="while-editing"
          icon={<SymbolView name="magnifyingglass" size={20} tintColor={colors.primary} />}
        />
      </View>

      <View style={styles.seasonFilters}>
        {seasons.map((season) => (
          <Pressable
            key={season.id}
            style={[badgeStyles.badge, styles.seasonBadge, { backgroundColor: filterSeasonIds.includes(season.id) ? colors.primary : colors.surface_container_highest }]}
            onPress={() => toggleSeason(season.id)}
          >
            <Text style={[styles.seasonBadgeText, { color: filterSeasonIds.includes(season.id) ? colors.surface_container_lowest : colors.on_surface_variant }]}>{season.name}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        style={styles.flatList}
        data={filteredPlayers}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PlayerListItem
            player={item}
            visible={visibleIds.has(item.id)}
            onPress={() => router.push(`/players/${item.id}`)}
          />
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
  seasonFilters: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  seasonBadge: {
    paddingVertical: 12,
    borderRadius: 9999,
  },
  seasonBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
  flatList: {
    flex: 1,
  },
  list: {
    gap: 12,
  },
})
