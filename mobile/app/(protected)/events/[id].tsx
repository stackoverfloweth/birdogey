import { useMutation, useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { useApiClient } from '@/contexts/ApiClientContext'
import { EventPlayerRequest, EventRequest, isActiveEvent } from '@birdogey/shared'
import { EventPlayersActiveList } from '@/components/EventPlayersActiveList'
import { EventPlayersInactiveList } from '@/components/EventPlayersInactiveList'
import { queryClient } from '@/services/queryClient'

export default function EventView(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>()

  const api = useApiClient()
  const { data: event, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events', id],
    queryFn: () => api.event.getById(id),
  })
  const eventPlayers = useMemo(() => event?.players ?? [], [event])

  const { mutate: updateEventPlayers } = useMutation({
    mutationFn: (players: EventPlayerRequest[]) => api.event.update(id, { ...event, players }),
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

  const { mutate: uncompleteEvent } = useMutation({
    mutationFn: () => api.event.uncomplete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {!!event && !isActiveEvent(event) && (
        <EventPlayersInactiveList
          event={event}
          eventPlayers={eventPlayers}
          isRefreshing={isRefetching}
          onRefresh={() => void refetch()}
          onUncompleteEvent={uncompleteEvent}
        />
      )}
      {!!event && isActiveEvent(event) && (
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
