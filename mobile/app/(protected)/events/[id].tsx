import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { colors } from '@/theme/colors'
import { calculateEventAcePot, calculateEventCtpPot, EventPlayerRequest, penniesToUSD, pluralize } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { EventPlayersList } from '@/components/EventPlayersList'

export default function EventView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.event.getById(id),
  })
  const { data: players = [] } = useQuery({
    queryKey: ['players', event?.seasonId],
    queryFn: () => api.user.getList(event?.seasonId ? [event.seasonId] : undefined),
    enabled: !!event?.seasonId,
  })

  const [eventPlayers, setEventPlayers] = useState<EventPlayerRequest[]>([])

  const ctpUserIds = useMemo(() => event?.ctpUserIds, [event])
  const aceUserIds = useMemo(() => event?.aceUserIds, [event])
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

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={colors.primary} />}
      {!isLoading && !!event && (
        <>
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <View style={[styles.headerItem, { backgroundColor: 'transparent', alignItems: 'flex-start' }]}>
              <Text style={[styles.headerItemSecondaryText, { color: colors.on_surface_variant }]}>Total Players</Text>
              <Text style={[styles.headerItemPrimaryText, { color: colors.on_surface }]}>{ctpUserIds?.length ?? 0}</Text>
            </View>
            <View style={[styles.headerItem, { backgroundColor: 'transparent', alignItems: 'flex-end' }]}>
              <SymbolView name="person.2.fill" size={100} tintColor={colors.surface_container_high} />
            </View>
          </View>
          <View style={styles.header}>
            <View style={styles.headerItem}>
              <Text style={styles.headerItemSecondaryText}>Ace Pot</Text>
              <Text style={styles.headerItemPrimaryText}>{penniesToUSD(aceInPennies)}</Text>
              <Text style={styles.headerItemSecondaryText}>
                {ctpUserIds?.length}
                {' '}
                {pluralize(ctpUserIds?.length ?? 0, 'player')}
              </Text>
            </View>

            <View style={styles.headerItem}>
              <Text style={styles.headerItemSecondaryText}>CTP Pool</Text>
              <Text style={styles.headerItemPrimaryText}>{penniesToUSD(ctpInPennies)}</Text>
              <Text style={styles.headerItemSecondaryText}>
                {ctpUserIds?.length}
                {' '}
                {pluralize(ctpUserIds?.length ?? 0, 'player')}
              </Text>
            </View>
          </View>
          <View style={styles.playersList}>
            <EventPlayersList seasonId={event.seasonId} eventPlayers={eventPlayers} onPlayersChanged={setEventPlayers} />
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    borderRadius: 42,
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
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
  playersList: {
    flex: 1,
  },
})
