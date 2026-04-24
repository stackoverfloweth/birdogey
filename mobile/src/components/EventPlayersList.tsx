import { EventPlayerRequest, UserSeason } from '@birdogey/shared'
import { useQuery } from '@tanstack/react-query'
import { FlatList, RefreshControl, StyleSheet, Text, View, ViewToken } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useCallback, useMemo, useState } from 'react'
import { PlayerListItem } from '@/components/PlayerListItem'

type EventPlayersListProps = {
  seasonId: string,
  eventPlayers: EventPlayerRequest[],
  isRefreshing?: boolean,
  onRefresh?: () => void,
  listHeader?: React.ReactNode,
}

type PlayerInEvent = EventPlayerRequest & UserSeason

export function EventPlayersList({ seasonId, eventPlayers, isRefreshing, onRefresh, listHeader }: EventPlayersListProps): React.ReactNode {
  const api = useApiClient()

  const { data: players = [], isFetched } = useQuery({
    queryKey: ['players', seasonId],
    queryFn: () => api.user.getSeasonList(seasonId),
    enabled: !!seasonId,
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

  function renderRightState(player: PlayerInEvent): React.ReactNode {
    return (
      <Text>{player.score}</Text>
    )
  }

  function renderSubTitle(player: PlayerInEvent): React.ReactNode {
    return (
      <Text>{player.outgoingTagId ? `#${player.outgoingTagId}` : 'No tag'}</Text>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={playersInEvent}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader ? <>{listHeader}</> : null}
        ListHeaderComponentStyle={listHeader ? styles.listHeader : undefined}
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
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  list: {
    gap: 8,
    paddingBottom: 16,
  },
  listHeader: {
    gap: 16,
    marginBottom: 16,
  },
})
