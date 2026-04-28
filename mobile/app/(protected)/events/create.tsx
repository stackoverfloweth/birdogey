import { EventForm } from '@/components/EventForm'
import { EventSeasonSelect } from '@/components/EventSeasonSelect'
import { useApiClient } from '@/contexts/ApiClientContext'
import { formStyles } from '@/theme/forms'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function EventView(): React.ReactNode {
  const [seasonId, setSeasonId] = useState('')
  const api = useApiClient()

  const { data: events = [] } = useQuery({
    queryKey: ['events', seasonId],
    queryFn: () => api.event.getList(seasonId),
  })

  const latestEvent = useMemo(() => {
    const [first] = events.length === 0 ? [undefined] : events

    return first
  }, [events])

  return (
    <ScrollView contentContainerStyle={formStyles.form}>
      <EventSeasonSelect value={seasonId} onChange={setSeasonId} />
      {latestEvent && <EventForm key={seasonId} lastEvent={latestEvent} />}
    </ScrollView>
  )
}
