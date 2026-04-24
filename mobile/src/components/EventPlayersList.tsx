import { EventPlayerRequest, UserSeason } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View, ViewToken } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { formStyles } from '@/theme/forms'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { PlayerListItem } from './PlayerListItem'
import { router } from 'expo-router'

type EventPlayersListProps = {
  seasonId: string,
  eventPlayers: EventPlayerRequest[],
  onPlayersChanged?: (players: EventPlayerRequest[]) => void,
}

export function EventPlayersList({ seasonId, eventPlayers, onPlayersChanged }: EventPlayersListProps): React.ReactNode {
  const [playerSearch, setPlayerSearch] = useState('')
  const [playerSearchFocused, setPlayerSearchFocused] = useState(false)
  const api = useApiClient()

  const { data: players = [] } = useQuery({
    queryKey: ['players', seasonId],
    queryFn: () => api.user.getSeasonList(seasonId),
    enabled: !!seasonId,
  })

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleIds(new Set(viewableItems.map((item) => item.item.userId)))
  }, [])
  const playersInEvent = useMemo(() => {
    return players.filter((player) => eventPlayers.some((eventPlayer) => eventPlayer.userId === player.id))
  }, [players, eventPlayers])

  const playersNotInEvent = useMemo(() => {
    return players.filter((player) => !eventPlayers.some((eventPlayer) => eventPlayer.userId === player.id))
  }, [players, eventPlayers])

  const searchResults = useMemo(() => {
    return playersNotInEvent.filter((player) => player.name.toLowerCase().includes(playerSearch.toLowerCase()))
  }, [playersNotInEvent, playerSearch])

  function setDoneAddingPlayers(): void {
    setPlayerSearch('')
    setPlayerSearchFocused(false)
    Keyboard.dismiss()
  }

  function handlePlayerAdd(player: UserSeason): void {
    onPlayersChanged?.([...eventPlayers, { userId: player.id, incomingTagId: player.tagId }])
    setDoneAddingPlayers()
  }

  return (
    <View style={styles.container}>
      <View style={[formStyles.formGroup, { flexDirection: 'row', gap: 24 }]}>
        <TextInput
          style={[formStyles.input, { flexGrow: 1 }]}
          placeholder="Add players"
          value={playerSearch}
          onChangeText={setPlayerSearch}
          onFocus={() => setPlayerSearchFocused(true)}
          onBlur={setDoneAddingPlayers}
          icon={<SymbolView name="magnifyingglass" size={20} tintColor={colors.primary} />}
        />
        {playerSearchFocused && (
          <Pressable style={[formStyles.button, { marginRight: -18, flexGrow: 0 }]} onPress={setDoneAddingPlayers}>
            <SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />
          </Pressable>
        )}
      </View>
      {eventPlayers.length === 0 && !playerSearchFocused && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No players yet</Text>
        </View>
      )}
      {searchResults.length > 0 && playerSearchFocused && (
        <FlatList
          data={searchResults}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePlayerAdd(item)}>
              <PlayerListItem player={item} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {!playerSearchFocused && (
        <FlatList
          data={playersInEvent}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <PlayerListItem player={item} visible={visibleIds.has(item.id)} />}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.on_surface_variant,
  },
  list: {
    gap: 8,
  },
})
