import { Event, EventPlayerRequest, UserSeason } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View, ViewToken } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { PotBalances } from '@/components/PotBalances'
import { PlayerListItem } from '@/components/PlayerListItem'
import { EventFormModal } from '@/components/EventFormModal'
import { Score } from './Score'
import { colors } from '@/theme/colors'
import { cardStyles } from '@/theme/card'
import { SymbolView } from 'expo-symbols'
import { formStyles } from '@/theme/forms'

type EventPlayersInactiveListProps = {
  event: Event,
  eventPlayers: EventPlayerRequest[],
  isRefreshing?: boolean,
  onUncompleteEvent?: () => void,
  onRefresh?: () => void,
}

type PlayerInEvent = EventPlayerRequest & UserSeason

export function EventPlayersInactiveList({ event, eventPlayers, isRefreshing, onUncompleteEvent, onRefresh }: EventPlayersInactiveListProps): React.ReactNode {
  const [eventModalVisible, setEventModalVisible] = useState(false)
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

  function renderHeader(): React.ReactElement {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable
            style={[cardStyles.card, { flex: 1, position: 'relative' }]}
            onPress={() => setEventModalVisible(true)}
          >
            <View style={{ position: 'absolute', right: 20, bottom: 14 }}>
              <SymbolView name="info.circle.fill" size={50} tintColor={colors.surface_container_high} />
            </View>

            <View>
              <Text style={[cardStyles.cardSecondaryText, { color: colors.on_surface }]}>Event Details</Text>
            </View>
          </Pressable>
          <View style={[cardStyles.card, { flex: 1, position: 'relative' }]}>
            <View style={{ position: 'absolute', right: 20, bottom: 0 }}>
              <SymbolView name="person.2.fill" size={80} tintColor={colors.surface_container_high} />
            </View>

            <View>
              <Text style={[cardStyles.cardSecondaryText, { color: colors.on_surface_variant }]}>Total Players</Text>
              <Text style={[cardStyles.cardPrimaryText, { color: colors.on_surface }]}>{eventPlayers.length}</Text>
            </View>
          </View>
        </View>
        <PotBalances event={event} eventPlayers={playersInEvent} />
      </View>
    )
  }

  function renderRightState(player: PlayerInEvent): React.ReactNode {
    return (
      <Score value={player.score} />
    )
  }

  function renderSubTitle(player: PlayerInEvent): React.ReactNode {
    return (
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Text>{player.outgoingTagId ? `#${player.outgoingTagId}` : 'No tag'}</Text>

        {player.frozen && <SymbolView name="snowflake" size={14} tintColor={colors.primary} />}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={playersInEvent}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <PlayerListItem
            player={item}
            visible={visibleIds.has(item.id)}
            right={renderRightState(item)}
            subTitle={renderSubTitle(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        refreshControl={<RefreshControl refreshing={isRefreshing ?? false} onRefresh={onRefresh} />}
        viewabilityConfig={{ itemVisiblePercentThreshold: 5 }}
      />

      <Pressable style={[formStyles.button, { paddingHorizontal: 12, paddingVertical: 12 }]} onPress={onUncompleteEvent}>
        <SymbolView name="lock.open.fill" size={30} tintColor={colors.surface_container_lowest} />
        <Text style={formStyles.buttonText}>Edit Event</Text>
      </Pressable>

      {eventModalVisible && (
        <EventFormModal
          event={event}
          visible={eventModalVisible}
          readOnly
          onDismiss={() => setEventModalVisible(false)}
          style={{ height: '93%' }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingVertical: 16,
  },
  flatList: {
    flex: 1,
  },
  header: {
    gap: 16,
    marginVertical: 8,
  },
  list: {
    gap: 8,
    paddingBottom: 16,
  },
})
