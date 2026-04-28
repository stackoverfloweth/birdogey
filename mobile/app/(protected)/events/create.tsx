import { EventForm } from '@/components/EventForm'
import { EventSeasonSelect } from '@/components/EventSeasonSelect'
import { useApiClient } from '@/contexts/ApiClientContext'
import { EventSchema } from '@birdogey/shared'
import { formStyles } from '@/theme/forms'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'
import { queryClient } from '@/services/queryClient'
import { router } from 'expo-router'

export default function EventView(): React.ReactNode {
  const [seasonId, setSeasonId] = useState('')
  const api = useApiClient()

  const { data: events = [] } = useQuery({
    queryKey: ['events', seasonId],
    queryFn: () => api.event.getList(seasonId),
  })

  const { mutate: createEvent } = useMutation({
    mutationFn: (data: EventSchema) => api.event.create({ seasonId, ...data }),
    onSuccess: (eventId) => {
      router.push(`/events/${eventId}`)
      queryClient.invalidateQueries({ queryKey: ['events', seasonId] })
    },
  })

  const latestEvent = useMemo(() => {
    const [first] = events.length === 0 ? [undefined] : events

    return first
  }, [events])

  return (
    <ScrollView contentContainerStyle={formStyles.form}>
      <EventSeasonSelect value={seasonId} onChange={setSeasonId} />
      {latestEvent && <EventForm key={seasonId} lastEvent={latestEvent} onSubmit={createEvent} />}
    </ScrollView>
  )
}
