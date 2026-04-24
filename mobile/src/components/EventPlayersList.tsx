import { EventPlayerRequest, UserSeason, Event } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { FlatList, Keyboard, Pressable, StyleSheet, Text, View, ViewToken } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { formStyles } from '@/theme/forms'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { PlayerListItem } from './PlayerListItem'

type EventPlayersListProps = {
  seasonId: string,
  event: Event,
  eventPlayers: EventPlayerRequest[],
  onPlayersChanged?: (players: EventPlayerRequest[]) => void,
  onEventChanged?: (event: Event) => void,
  listHeader?: React.ReactNode,
}

export function EventPlayersList({ seasonId, event, eventPlayers, onPlayersChanged, onEventChanged, listHeader }: EventPlayersListProps): React.ReactNode {
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
    setVisibleIds(new Set(viewableItems.map((item) => item.item.id)))
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

  function handlePlayerRemove(userId: string): void {
    onPlayersChanged?.(eventPlayers.filter((eventPlayer) => eventPlayer.userId !== userId))
  }

  function handleCtpToggle(player: UserSeason): void {
    const ctpUserIds = event.ctpUserIds.includes(player.id) ? event.ctpUserIds.filter((userId) => userId !== player.id) : [...event.ctpUserIds, player.id]
    onEventChanged?.({
      ...event,
      ctpUserIds,
    })
  }

  function handleAceToggle(player: UserSeason): void {
    const aceUserIds = event.aceUserIds.includes(player.id) ? event.aceUserIds.filter((userId) => userId !== player.id) : [...event.aceUserIds, player.id]
    onEventChanged?.({
      ...event,
      aceUserIds,
    })
  }

  function renderRightActions(player: UserSeason): React.ReactNode {
    return (
      <View style={styles.swipeActions}>
        <Pressable style={[styles.swipeAction, event.aceUserIds.includes(player.id) ? styles.swipeActionActive : undefined]} onPress={() => handleAceToggle(player)}>
          <Text style={styles.swipeActionText}>ACE</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, event.ctpUserIds.includes(player.id) ? styles.swipeActionActive : undefined]} onPress={() => handleCtpToggle(player)}>
          <Text style={styles.swipeActionText}>CTP</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, styles.swipeActionRemove]} onPress={() => handlePlayerRemove(player.id)}>
          <SymbolView name="trash" size={24} tintColor="#fff" weight="bold" />
        </Pressable>
      </View>
    )
  }

  function renderRightState(player: UserSeason): React.ReactNode {
    return (
      <View style={styles.swipeActions}>
        <Text>Pocket Change</Text>
      </View>
    )
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
      {searchResults.length > 0 && playerSearchFocused && (
        <FlatList
          data={searchResults}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePlayerAdd(item)}>
              <PlayerListItem player={item} right={renderRightState(item)} />
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {!playerSearchFocused && (
        <FlatList
          data={playersInEvent}
          contentContainerStyle={styles.list}
          ListHeaderComponent={listHeader ? <>{listHeader}</> : null}
          ListHeaderComponentStyle={listHeader ? styles.listHeader : undefined}
          renderItem={({ item }) => (
            <ReanimatedSwipeable renderRightActions={() => renderRightActions(item)} overshootRight={false}>
              <PlayerListItem player={item} visible={visibleIds.has(item.id)} right={renderRightState(item)} />
            </ReanimatedSwipeable>
          )}
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
    paddingBottom: 16,
  },
  listHeader: {
    gap: 16,
    marginBottom: 16,
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  swipeAction: {
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    gap: 4,
    backgroundColor: colors.outline_variant,
  },
  swipeActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.surface_container_lowest,
  },
  swipeActionActive: {
    backgroundColor: colors.primary_500,
  },
  swipeActionRemove: {
    backgroundColor: colors.error,
  },
})
