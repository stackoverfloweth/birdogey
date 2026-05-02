import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView, Alert, Text } from 'react-native'
import { modalStyles } from '@/theme/modals'
import { EventForm } from '@/components/EventForm'
import { Event, EventSchema, EventSchemaInput, toEventSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { colors } from '@/theme/colors'
import { useApiClient } from '@/contexts/ApiClientContext'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { queryClient } from '@/services/queryClient'
import { formStyles } from '@/theme/forms'

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
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalStyles.backdrop} onPress={onDismiss} />

      <View style={[modalStyles.content, style]}>
        <View style={modalStyles.header}>
          <Pressable style={[formStyles.iconButton, { backgroundColor: colors.outline_variant }]} onPress={onDismiss}>
            <SymbolView name="xmark" size={30} tintColor="#fff" weight="bold" />
          </Pressable>
        </View>

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
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    position: 'relative',
    paddingBottom: 24,
  },
  submitButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    backgroundColor: colors.primary,
  },
})
