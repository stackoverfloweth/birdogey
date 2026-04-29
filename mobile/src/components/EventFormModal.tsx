import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView, Alert, Text } from 'react-native'
import { modalsStyles } from '@/theme/modals'
import { EventForm } from '@/components/EventForm'
import { Event, EventSchema, EventSchemaInput, toEventSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'
import { formStyles } from '@/theme/forms'
import { FormState } from 'react-hook-form'
import { colors } from '@/theme/colors'
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

  function renderActions(formState: FormState<EventSchemaInput>, handleSubmit: () => Promise<void>): React.ReactNode {
    return (
      <Pressable
        disabled={formState.isLoading}
        style={[formStyles.iconButton, styles.submitButton]}
        onPress={() => void handleSubmit()}
      >
        <SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />
      </Pressable>
    )
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalsStyles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, style]}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <EventForm
            submitText="Save"
            submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
            initialValues={initialValues}
            renderActions={renderActions}
            onSubmit={(data) => onSubmit?.(data)}
            onCancel={onDismiss}
          />
          <Pressable style={formStyles.dangerButton} onPress={handleDelete}>
            <SymbolView name="trash" size={20} tintColor="#fff" weight="bold" />
            <Text style={formStyles.dangerButtonText}>Delete Event</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 64,
    gap: 16,
    position: 'relative',
  },
  submitButton: {
    position: 'absolute',
    top: 12,
    right: 18,
    backgroundColor: colors.primary,
  },
})
