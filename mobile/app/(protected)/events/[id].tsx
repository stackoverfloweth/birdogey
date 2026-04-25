import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { colors } from '@/theme/colors'
import { calculateEventAcePot, calculateEventCtpPot, EventPlayerRequest, EventRequest, penniesToUSD, isActiveEvent } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { EventPlayersList } from '@/components/EventPlayersList'
import { ActiveEventPlayersList } from '@/components/ActiveEventPlayersList'
import { StackedPlayerImages } from '@/components/StackedPlayerImages'

export default function EventView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const queryClient = useQueryClient()
  const { data: event, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.event.getById(id),
  })

  const eventPlayers = useMemo(() => event?.players ?? [], [event])

  const { mutate: updateEventPlayers } = useMutation({
    mutationFn: (players: EventPlayerRequest[]) => api.event.update(id, { players }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    },
  })

  const { mutate: updateEvent } = useMutation({
    mutationFn: (event: Partial<EventRequest>) => api.event.update(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] })
    },
  })

  const ctpWinnerUserIds = useMemo(() => event?.ctpUserIds ?? [], [event])
  const aceWinnerUserIds = useMemo(() => event?.aceUserIds ?? [], [event])
  const ctpUsers = useMemo(() => eventPlayers.filter((player) => player.inForCtp), [eventPlayers])
  const aceUsers = useMemo(() => eventPlayers.filter((player) => player.inForAce), [eventPlayers])
  const ctpStartingBalance = useMemo(() => event?.ctpStartingBalance ?? 0 / 100, [event])
  const aceStartingBalance = useMemo(() => event?.aceStartingBalance ?? 0 / 100, [event])
  const ctpPerPlayer = useMemo(() => event?.ctpPerPlayer ?? 0 / 100, [event])
  const acePerPlayer = useMemo(() => event?.acePerPlayer ?? 0 / 100, [event])

  const ctpInPennies = useMemo(() => {
    if (!event) {
      return 0
    }

    return calculateEventCtpPot({
      ...event,
      players: eventPlayers,
    })
  }, [event, eventPlayers])

  const aceInPennies = useMemo(() => {
    if (!event) {
      return 0
    }

    return calculateEventAcePot({
      ...event,
      players: eventPlayers,
    })
  }, [event, eventPlayers])

  function renderListHeader(): React.ReactNode {
    return (
      <>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={[styles.headerItem, { backgroundColor: 'transparent', alignItems: 'flex-start' }]}>
            <Text style={[styles.headerItemSecondaryText, { color: colors.on_surface_variant }]}>Total Players</Text>
            <Text style={[styles.headerItemPrimaryText, { color: colors.on_surface }]}>{eventPlayers.length}</Text>
          </View>
          <View style={[styles.headerItem, { backgroundColor: 'transparent', alignItems: 'flex-end' }]}>
            <SymbolView name="person.2.fill" size={100} tintColor={colors.surface_container_high} />
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Text style={styles.headerItemSecondaryText}>Ace Pot</Text>
            <Text style={styles.headerItemPrimaryText}>{penniesToUSD(aceInPennies)}</Text>
            <View style={{ gap: 2 }}>
              <StackedPlayerImages playerIds={aceWinnerUserIds} />
            </View>
          </View>

          <View style={styles.headerItem}>
            <Text style={styles.headerItemSecondaryText}>CTP Pool</Text>
            <Text style={styles.headerItemPrimaryText}>{penniesToUSD(ctpInPennies)}</Text>
            <View style={{ gap: 2 }}>
              <StackedPlayerImages playerIds={ctpWinnerUserIds} />
            </View>
          </View>
        </View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={colors.primary} />}
      {!isLoading && !!event && !isActiveEvent(event) && (
        <EventPlayersList
          seasonId={event.seasonId}
          eventPlayers={eventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
          listHeader={renderListHeader()}
        />
      )}
      {!isLoading && !!event && isActiveEvent(event) && (
        <ActiveEventPlayersList
          seasonId={event.seasonId}
          eventPlayers={eventPlayers}
          onPlayersChanged={updateEventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
          listHeader={renderListHeader()}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderRadius: 42,
  },
  headerItem: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 24,
    borderRadius: 42,
  },
  headerItemPrimaryText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.surface_container_lowest,
  },
  headerItemSecondaryText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: colors.surface_container_highest,
  },
})
