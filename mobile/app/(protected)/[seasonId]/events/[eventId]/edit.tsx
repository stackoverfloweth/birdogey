import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { router, useGlobalSearchParams } from 'expo-router'
import { useEvent } from '@/hooks/useEvent'
import { useUpdateEvent } from '@/hooks/useUpdateEvent'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import type { Event } from '@birdogey/shared'

export default function EditEventScreen(): React.ReactNode {
  const { eventId } = useGlobalSearchParams<{ seasonId: string, eventId: string }>()
  const { data: event, isLoading } = useEvent(eventId)

  if (isLoading) return <LoadingSpinner />
  if (!event) return null

  return <EditEventForm event={event} />
}

function EditEventForm({ event }: { event: Event }): React.ReactNode {
  const { seasonId, eventId } = useGlobalSearchParams<{ seasonId: string, eventId: string }>()
  const updateEvent = useUpdateEvent(seasonId, eventId)

  const [notes, setNotes] = useState(event.notes ?? '')
  const [ctpPerPlayer, setCtpPerPlayer] = useState(String(event.ctpPerPlayer))
  const [acePerPlayer, setAcePerPlayer] = useState(String(event.acePerPlayer))

  async function handleSubmit(): Promise<void> {
    try {
      await updateEvent.mutateAsync({
        notes: notes || undefined,
        ctpPerPlayer: ctpPerPlayer ? Number(ctpPerPlayer) : undefined,
        acePerPlayer: acePerPlayer ? Number(acePerPlayer) : undefined,
      })
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to update event')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

      <Text style={styles.label}>CTP Per Player ($)</Text>
      <TextInput style={styles.input} value={ctpPerPlayer} onChangeText={setCtpPerPlayer} keyboardType="numeric" />

      <Text style={styles.label}>Ace Per Player ($)</Text>
      <TextInput style={styles.input} value={acePerPlayer} onChangeText={setAcePerPlayer} keyboardType="numeric" />

      <Pressable style={styles.button} onPress={() => void handleSubmit()} disabled={updateEvent.isPending}>
        <Text style={styles.buttonText}>{updateEvent.isPending ? 'Saving...' : 'Save Changes'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
