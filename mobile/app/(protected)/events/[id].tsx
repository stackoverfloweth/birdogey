import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { colors } from '@/theme/colors'
import { EventPlayerRequest, EventRequest, isActiveEvent } from '@birdogey/shared'
import { PotBalances } from '@/components/PotBalances'
import { EventPlayersList } from '@/components/EventPlayersList'
import { EventCheckinPlayersList } from '@/components/EventCheckinPlayersList'
import { EventScoringPlayersList } from '@/components/EventScoringPlayersList'

export default function EventView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const queryClient = useQueryClient()
  const { data: event, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['event', id],
    queryFn: () => api.event.getById(id),
  })

  const [activeEventState, setActiveEventState] = useState<'checkin' | 'scoring'>('checkin')
  const eventState = useMemo(() => {
    if (event && !isActiveEvent(event)) {
      return 'past'
    }

    return activeEventState
  }, [event, activeEventState])
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

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={colors.primary} />}
      {!isLoading && !!event && eventState === 'past' && (
        <EventPlayersList
          event={event}
          eventPlayers={eventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
        />
      )}
      {!isLoading && !!event && eventState === 'checkin' && (
        <EventCheckinPlayersList
          event={event}
          eventPlayers={eventPlayers}
          onPlayersChanged={updateEventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
          onConfirm={() => setActiveEventState('scoring')}
        />
      )}
      {!isLoading && !!event && eventState === 'scoring' && (
        <EventScoringPlayersList
          event={event}
          eventPlayers={eventPlayers}
          onPlayersChanged={updateEventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
          onBack={() => setActiveEventState('checkin')}
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
})
