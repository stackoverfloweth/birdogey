import { Event, EventPlayerRequest, EventRequest, EventSchema, pluralize, UserSeason } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { Alert, FlatList, Keyboard, Pressable, RefreshControl, StyleSheet, Text, View, ViewToken } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { formStyles } from '@/theme/forms'
import { PotBalances } from '@/components/PotBalances'
import { TextInput } from '@/components/TextInput'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme/colors'
import { cardStyles } from '@/theme/card'
import { PlayersModal } from '@/components/PlayersModal'
import { EventFormModal } from '@/components/EventFormModal'
import { ScoreImportModal } from '@/components/ScoreImportModal'
import { PlayerListItemWithSwipeActions } from './PlayerListItemWithSwipeActions'

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

  const api = useApiClient()

  const { data: players = [], isFetched } = useQuery({
    queryKey: ['players', event.seasonId],
    queryFn: () => api.season.getUsersInSeason(event.seasonId),
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
          <PlayerListItemWithSwipeActions
            player={item}
            visible={visibleIds.has(item.id)}
            onChange={handlePlayerChanged}
            onRemove={handlePlayerRemove}
          />
        )}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={<RefreshControl refreshing={isRefreshing ?? false} onRefresh={onRefresh} />}
        viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
      />

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
})
