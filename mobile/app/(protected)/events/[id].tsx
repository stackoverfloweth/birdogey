import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { colors } from '@/theme/colors'
import { EventPlayerRequest, EventRequest, isActiveEvent } from '@birdogey/shared'
import { EventPlayersActiveList } from '@/components/EventPlayersActiveList'
import { EventPlayersInactiveList } from '@/components/EventPlayersInactiveList'

export default function EventView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const queryClient = useQueryClient()
  const { data: event, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events', id],
    queryFn: () => api.event.getById(id),
  })
  const eventPlayers = useMemo(() => event?.players ?? [], [event])

  const { mutate: updateEventPlayers } = useMutation({
    mutationFn: (players: EventPlayerRequest[]) => api.event.update(id, { players }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] })
    },
  })

  const { mutate: updateEvent } = useMutation({
    mutationFn: (event: Partial<EventRequest>) => api.event.update(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] })
    },
  })

  const { mutate: completeEvent } = useMutation({
    mutationFn: (event: Partial<EventRequest>) => api.event.complete(id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color={colors.primary} />}
      {!isLoading && !!event && !isActiveEvent(event) && (
        <EventPlayersInactiveList
          event={event}
          eventPlayers={eventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
        />
      )}
      {!isLoading && !!event && isActiveEvent(event) && (
        <EventPlayersActiveList
          event={event}
          eventPlayers={eventPlayers}
          onPlayersChanged={updateEventPlayers}
          onEventChanged={updateEvent}
          onCompleteEvent={completeEvent}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
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
