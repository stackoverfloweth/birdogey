import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useCreateEvent } from '@/hooks/useCreateEvent'

export default function CreateEventScreen(): React.ReactNode {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>()
  const createEvent = useCreateEvent(seasonId)

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [ctpPerPlayer, setCtpPerPlayer] = useState('')
  const [acePerPlayer, setAcePerPlayer] = useState('')

  async function handleSubmit(): Promise<void> {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }

    try {
      await createEvent.mutateAsync({
        name: name.trim(),
        notes: notes || undefined,
        ctpPerPlayer: ctpPerPlayer ? Number(ctpPerPlayer) : 0,
        acePerPlayer: acePerPlayer ? Number(acePerPlayer) : 0,
      })
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to create event')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Event</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Event name" />

      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

      <Text style={styles.label}>CTP Per Player ($)</Text>
      <TextInput style={styles.input} value={ctpPerPlayer} onChangeText={setCtpPerPlayer} keyboardType="numeric" placeholder="0" />

      <Text style={styles.label}>Ace Per Player ($)</Text>
      <TextInput style={styles.input} value={acePerPlayer} onChangeText={setAcePerPlayer} keyboardType="numeric" placeholder="0" />

      <Pressable style={styles.button} onPress={() => void handleSubmit()} disabled={createEvent.isPending}>
        <Text style={styles.buttonText}>{createEvent.isPending ? 'Creating...' : 'Create Event'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
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
