import { Pressable, StyleSheet, View, Modal, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { modalsStyles } from '@/theme/modals'
import { EventForm } from '@/components/EventForm'
import { Event, EventSchema, EventSchemaInput, toEventSchemaInput } from '@birdogey/shared'
import { SymbolView } from 'expo-symbols'
import { useMemo } from 'react'

type EventFormModalProps = {
  event: Event,
  visible?: boolean,
  onDismiss?: () => void,
  onSubmit?: (event: EventSchema) => void,
  style?: StyleProp<ViewStyle>,
}

export function EventFormModal({ event, visible, onDismiss, onSubmit, style }: EventFormModalProps): React.ReactNode {
  const initialValues = useMemo<EventSchemaInput | undefined>(() => {
    return toEventSchemaInput(event)
  }, [event])

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => {}}>
      <Pressable style={modalsStyles.backdrop} onPress={onDismiss} />

      <View style={[modalsStyles.content, style]}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <EventForm
            submitText="Save"
            submitIcon={<SymbolView name="checkmark" size={20} tintColor="#fff" weight="bold" />}
            initialValues={initialValues}
            onSubmit={(data) => onSubmit?.(data)}
            onCancel={onDismiss}
          />
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 24,
    gap: 16,
  },
})
