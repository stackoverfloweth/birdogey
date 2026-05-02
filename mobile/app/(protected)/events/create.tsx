import { EventForm } from '@/components/EventForm'
import { EventSeasonSelect } from '@/components/EventSeasonSelect'
import { useApiClient } from '@/contexts/ApiClientContext'
import { calculateEventAcePotIfNoWinners, calculateEventCtpPotIfNoWinners, EventSchema, EventSchemaInput, getNextCtpHole, toEventSchemaInput } from '@birdogey/shared'
import { formStyles } from '@/theme/forms'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { queryClient } from '@/services/queryClient'
import { router } from 'expo-router'
import { format } from 'date-fns'
import { SymbolView } from 'expo-symbols'
import { useSeason } from '@/hooks/useSeason'
import { cardStyles } from '@/theme/card'

export default function EventCreate(): React.ReactNode {
  const [seasonId, setSeasonId] = useState('')
  const api = useApiClient()
  const season = useSeason(seasonId)

  const { data: events = [] } = useQuery({
    queryKey: ['events', seasonId],
    queryFn: () => api.event.getList(seasonId),
  })

  const { mutate: createEvent } = useMutation({
    mutationFn: (data: EventSchema) => api.event.create({ seasonId, ...data }),
    onSuccess: (eventId) => {
      router.push(`/events/${eventId}`)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const today = format(new Date(), 'MMMM do')

  const latestEvent = useMemo(() => {
    const [first] = events.length === 0 ? [undefined] : events

    return first
  }, [events])

  const initialValues = useMemo<EventSchemaInput | undefined>(() => {
    if (!latestEvent) return undefined

    return {
      ...toEventSchemaInput(latestEvent),
      players: [],
      name: today,
      ctpStartingBalance: calculateEventCtpPotIfNoWinners(latestEvent) / 100,
      aceStartingBalance: calculateEventAcePotIfNoWinners(latestEvent) / 100,
      ctpHole: getNextCtpHole(latestEvent.ctpHole, season),
    }
  }, [season, latestEvent, today])

  return (
    <ScrollView style={{ margin: 16 }} contentContainerStyle={[cardStyles.card, styles.container]}>
      <View style={formStyles.form}>
        <EventSeasonSelect value={seasonId} onChange={setSeasonId} />
      </View>
      {latestEvent && (
        <EventForm
          key={seasonId}
          submitText="Create Event"
          submitIcon={<SymbolView name="plus" size={20} tintColor="#fff" weight="bold" />}
          initialValues={initialValues}
          onSubmit={createEvent}
          onCancel={() => router.back()}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    gap: 78,
  },
})
