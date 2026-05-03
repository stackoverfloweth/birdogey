import { Event, EventPlayerRequest, EventRequest, EventSchema, pluralize, UserSeason } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { Alert, FlatList, Keyboard, Pressable, RefreshControl, StyleSheet, Text, View, ViewToken } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { formStyles } from '@/theme/forms'
import { PotBalances } from '@/components/PotBalances'
import { TextInput } from '@/components/TextInput'
import { PlayerListItem } from '@/components/PlayerListItem'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { cardStyles } from '@/theme/card'
import { Score } from '@/components/Score'
import { ScoreModal } from '@/components/ScoreModal'
import { PlayersModal } from '@/components/PlayersModal'
import { EventFormModal } from '@/components/EventFormModal'
import { ScoreImportModal } from '@/components/ScoreImportModal'
import { EventPlayerModal } from '@/components/EventPlayerModal'

type EventPlayersActiveListProps = {
  event: Event,
  eventPlayers: EventPlayerRequest[],
  onPlayersChanged?: (players: EventPlayerRequest[]) => void,
  onEventChanged?: (event: Partial<EventRequest>) => void,
  onCompleteEvent?: (event: Partial<EventRequest>) => void,
  isRefreshing?: boolean,
  onRefresh?: () => void,
}

export type PlayerInEvent = EventPlayerRequest & UserSeason

export function EventPlayersActiveList({ event, eventPlayers, onPlayersChanged, onEventChanged, onCompleteEvent, isRefreshing, onRefresh }: EventPlayersActiveListProps): React.ReactNode {
  const [playerSearch, setPlayerSearch] = useState('')
  const [playerSearchModalVisible, setPlayerSearchModalVisible] = useState(false)
  const [eventModalVisible, setEventModalVisible] = useState(false)
  const [scoreImportModalVisible, setScoreImportModalVisible] = useState(false)
  const [editModalPlayer, setEditModalPlayer] = useState<PlayerInEvent | undefined>(undefined)
  const [scoreModalPlayer, setScoreModalPlayer] = useState<PlayerInEvent | undefined>(undefined)

  const api = useApiClient()

  const { data: players = [], isFetched } = useQuery({
    queryKey: ['players', event.seasonId],
    queryFn: () => api.user.getUsersInSeason(event.seasonId),
    enabled: !!event.seasonId,
  })

  const playersMap = useMemo(() => {
    return players.reduce((players, player) => {
      players.set(player.id, player)
      return players
    }, new Map<string, UserSeason>())
  }, [players])

  const getPlayer = useCallback((userId: string): UserSeason => {
    const player = playersMap.get(userId)

    if (!player) {
      throw new Error(`Player not found: ${userId}`)
    }

    return player
  }, [playersMap])

  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    setVisibleIds(new Set(viewableItems.map((item) => item.item.id)))
  }, [])

  const playersInEvent = useMemo<PlayerInEvent[]>(() => {
    if (!isFetched) {
      return []
    }

    return eventPlayers.map((player) => ({
      ...player,
      ...getPlayer(player.userId),
    }))
  }, [getPlayer, eventPlayers, isFetched])

  const playersNotInEvent = useMemo(() => {
    return players.filter((player) => !eventPlayers.some((eventPlayer) => eventPlayer.userId === player.id))
  }, [players, eventPlayers])

  const searchResults = useMemo(() => {
    return playersNotInEvent.filter((player) => player.name.toLowerCase().includes(playerSearch.toLowerCase()))
  }, [playersNotInEvent, playerSearch])

  const playersWithoutScore = useMemo(() => {
    return playersInEvent.filter((player) => player.score === undefined)
  }, [playersInEvent])

  function confirmCompleteEvent(): void {
    if (playersWithoutScore.length > 0) {
      Alert.alert(`There are ${playersWithoutScore.length} players without a score.`, 'Please add scores for all players before completing the event.')
      return
    }

    const ctpWinners = event.ctpUserIds.map((userId) => playersMap.get(userId))
    const ctpMessage = ctpWinners.length > 0 ? `CTP ${pluralize(ctpWinners.length, 'winner')} ${ctpWinners.map((winner) => winner?.name).join(', ')}` : 'No CTP winners'
    const aceWinners = event.aceUserIds.map((userId) => playersMap.get(userId))
    const aceMessage = aceWinners.length > 0 ? `ACE ${pluralize(aceWinners.length, 'winner')} ${aceWinners.map((winner) => winner?.name).join(', ')}` : 'No ACE winners'

    Alert.alert('Did you set CTP and ACE?', `${ctpMessage}\n${aceMessage}`, [
      {
        text: 'Yes, complete event',
        style: 'default',
        onPress: () => onCompleteEvent?.({
          ...event,
          players: eventPlayers,
        }),
      },
      { text: 'No, go back', style: 'cancel' },
    ])
  };

  function setDoneAddingPlayers(): void {
    setPlayerSearch('')
    setPlayerSearchModalVisible(false)
    Keyboard.dismiss()
  }

  function handlePlayerAdd(player: UserSeason): void {
    onPlayersChanged?.([...eventPlayers, { userId: player.id, incomingTagId: player.tagId }])
  }

  function handlePlayerRemove(userId: string): void {
    onPlayersChanged?.(eventPlayers.filter((eventPlayer) => eventPlayer.userId !== userId))
  }

  function handlePlayerChanged(player: PlayerInEvent): void {
    onPlayersChanged?.(eventPlayers.map((existingPlayer) => (existingPlayer.userId === player.userId ? player : existingPlayer)))
  }

  function handleCtpToggle(player: PlayerInEvent): void {
    const inForCtp = !player.inForCtp
    handlePlayerChanged({ ...player, inForCtp })
  }

  function handleAceToggle(player: PlayerInEvent): void {
    const inForAce = !player.inForAce
    handlePlayerChanged({ ...player, inForAce })
  }

  function handleEventModalSave(event: EventSchema): void {
    onEventChanged?.({
      ...event,
      players: eventPlayers,
    })
    setEventModalVisible(false)
  }

  async function applyScores(scores: Map<string, number>): Promise<void> {
    onPlayersChanged?.(eventPlayers.map((player) => {
      const score = scores.get(player.userId)

      if (typeof score === 'number') {
        return { ...player, score }
      }

      return player
    }))
  }

  function renderHeader(): React.ReactElement {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 12 }}>
          <Pressable
            style={[formStyles.button, { flex: 1, paddingVertical: 12 }]}
            onPress={() => setEventModalVisible(true)}
          >
            {/* edit event */}
            <SymbolView name="gearshape.fill" size={30} tintColor={colors.surface_container_lowest} />
          </Pressable>

          <Pressable style={[formStyles.button, { flex: 1, paddingVertical: 12 }]} onPress={() => setScoreImportModalVisible(true)}>
            {/* import */}
            <SymbolView name="arrow.up.document.fill" size={30} tintColor={colors.surface_container_lowest} />
          </Pressable>

          <Pressable style={[formStyles.button, { flex: 1, paddingVertical: 12 }]} onPress={confirmCompleteEvent}>
            {/* complete event */}
            <SymbolView name="lock.fill" size={30} tintColor={colors.surface_container_lowest} />
          </Pressable>
        </View>

        <Pressable style={[cardStyles.card, { gap: 24 }]} onPress={() => setPlayerSearchModalVisible(true)}>
          <View>
            <Text style={[cardStyles.cardSecondaryText, { color: colors.on_surface_variant }]}>Total Players</Text>
            <Text style={[cardStyles.cardPrimaryText, { color: colors.on_surface }]}>{eventPlayers.length}</Text>
            {playersWithoutScore.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <SymbolView name="exclamationmark.triangle.fill" size={16} tintColor={colors.error} />
                <Text style={{ color: colors.error, fontWeight: 'bold' }}>
                  {playersWithoutScore.length}
                  {' '}
                  missing score
                </Text>
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', right: 16, top: 16 }}>
            <SymbolView name="person.2.fill" size={100} tintColor={colors.surface_container_high} />
          </View>
        </Pressable>

        <PotBalances event={event} eventPlayers={playersInEvent} onChange={onEventChanged} />
      </View>
    )
  }

  function renderRightActions(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={styles.swipeActions}>
        <Pressable style={[styles.swipeAction, player.inForAce ? styles.swipeActionActive : undefined]} onPress={() => handleAceToggle(player)}>
          <Text style={styles.swipeActionText}>ACE</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, player.inForCtp ? styles.swipeActionActive : undefined]} onPress={() => handleCtpToggle(player)}>
          <Text style={styles.swipeActionText}>CTP</Text>
        </Pressable>
        <Pressable style={[styles.swipeAction, styles.swipeActionRemove]} onPress={() => handlePlayerRemove(player.userId)}>
          <SymbolView name="trash" size={24} tintColor="#fff" weight="bold" />
        </Pressable>
      </View>
    )
  }

  function renderRightState(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Pressable onPress={() => setScoreModalPlayer(player)}>
          {player.score === undefined ? <SymbolView name="exclamationmark.triangle.fill" size={32} tintColor={colors.error} /> : <Score value={player.score} />}
        </Pressable>
      </View>
    )
  }

  function renderSubTitle(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Text>{player.incomingTagId ? `#${player.incomingTagId}` : 'No tag'}</Text>

        <Text style={player.inForAce ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.outline_variant }}>ACE</Text>

        <Text style={player.inForCtp ? { color: colors.primary, fontWeight: 'bold' } : { color: colors.outline_variant }}>CTP</Text>
      </View>
    )
  }

  function renderBeforeList(): React.ReactNode {
    return (
      <View style={[formStyles.formGroup, { flexDirection: 'row', gap: 24 }]}>
        <TextInput
          style={{ flexGrow: 1 }}
          placeholder="Add players"
          value={playerSearch}
          onChangeText={setPlayerSearch}
          clearButtonMode="while-editing"
          icon={<SymbolView name="magnifyingglass" size={20} tintColor={colors.primary} />}
        />

        <Pressable style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]} onPress={setDoneAddingPlayers}>
          <SymbolView name="chevron.down" size={30} tintColor="#fff" weight="bold" />
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={playersInEvent}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <ReanimatedSwipeable renderRightActions={() => renderRightActions(item)} overshootRight={false}>
            <PlayerListItem
              player={item}
              visible={visibleIds.has(item.id)}
              right={renderRightState(item)}
              subTitle={renderSubTitle(item)}
              onPress={() => setEditModalPlayer(item)}
            />
          </ReanimatedSwipeable>
        )}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={<RefreshControl refreshing={isRefreshing ?? false} onRefresh={onRefresh} />}
        viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
      />

      {scoreModalPlayer && (
        <ScoreModal
          player={scoreModalPlayer}
          onDismiss={() => setScoreModalPlayer(undefined)}
          onChange={handlePlayerChanged}
        />
      )}

      {editModalPlayer && (
        <EventPlayerModal
          player={editModalPlayer}
          onSubmit={handlePlayerChanged}
          onDismiss={() => setEditModalPlayer(undefined)}
        />
      )}

      <PlayersModal
        players={searchResults}
        visible={playerSearchModalVisible}
        beforeList={renderBeforeList}
        onSelect={handlePlayerAdd}
        onDismiss={setDoneAddingPlayers}
        style={{ height: '93%' }}
        keyExtractor={(item) => item.id}
      />

      {eventModalVisible && (
        <EventFormModal
          event={event}
          visible={eventModalVisible}
          onDismiss={() => setEventModalVisible(false)}
          onSubmit={handleEventModalSave}
          style={{ height: '93%' }}
        />
      )}

      {scoreImportModalVisible && (
        <ScoreImportModal
          seasonId={event.seasonId}
          players={playersInEvent}
          eventPlayers={eventPlayers}
          visible={scoreImportModalVisible}
          onSubmit={(scores) => void applyScores(scores)}
          onDismiss={() => setScoreImportModalVisible(false)}
          style={{ height: '93%' }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 8,
    marginVertical: 8,
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
    backgroundColor: colors.primary,
  },
  swipeActionRemove: {
    backgroundColor: colors.error,
  },
})
