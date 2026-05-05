import { StyleSheet, StyleProp, ViewStyle, ScrollView, Alert } from 'react-native'
import { BottomSheet } from '@/components/BottomSheet'
import { EventForm } from '@/components/EventForm'
import { Event, EventSchema, EventSchemaInput, toEventSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { queryClient } from '@/services/queryClient'

type EventFormModalProps = {
  event: Event,
  visible?: boolean,
  onDismiss?: () => void,
  onSubmit?: (event: EventSchema) => void,
  style?: StyleProp<ViewStyle>,
}

export function EventFormModal({ event, visible, onDismiss, onSubmit, style }: EventFormModalProps): React.ReactNode {
  const apiClient = useApiClient()

  const initialValues = useMemo<EventSchemaInput | undefined>(() => {
    return toEventSchemaInput(event)
  }, [event])

  const { mutate: removeEvent } = useMutation({
    mutationFn: () => apiClient.event.remove(event.id),
    onSuccess: () => {
      onDismiss?.()
      router.replace('/events')
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  function handleDelete(): void {
    Alert.alert(
      'Are you sure?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Event',
          style: 'destructive',
          onPress: () => {
            removeEvent()
          },
        },
      ],
    )
  }

  return (
    <BottomSheet visible={!!visible} onDismiss={() => onDismiss?.()} contentStyle={style}>
      <ScrollView contentContainerStyle={styles.modalContent}>
        <EventForm
          submitText="Save"
          submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
          initialValues={initialValues}
          onSubmit={(data) => onSubmit?.(data)}
          onCancel={onDismiss}
          onDelete={handleDelete}
        />
      </ScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingBottom: 24,
  },
})
