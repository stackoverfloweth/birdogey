import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Switch, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useCreatePlayer } from '@/hooks/useCreatePlayer'

export default function CreatePlayerScreen(): React.ReactNode {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>()
  const createPlayer = useCreatePlayer(seasonId)

  const [name, setName] = useState('')
  const [tagId, setTagId] = useState('')
  const [udiscId, setUdiscId] = useState('')
  const [entryPaid, setEntryPaid] = useState(false)

  async function handleSubmit(): Promise<void> {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }

    try {
      await createPlayer.mutateAsync({
        name: name.trim(),
        tagId: tagId ? Number(tagId) : undefined,
        udiscId: udiscId || undefined,
        entryPaid,
      })
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to create player')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Player name" />

      <Text style={styles.label}>Tag ID</Text>
      <TextInput style={styles.input} value={tagId} onChangeText={setTagId} placeholder="Auto-assigned if empty" keyboardType="numeric" />

      <Text style={styles.label}>UDisc ID</Text>
      <TextInput style={styles.input} value={udiscId} onChangeText={setUdiscId} placeholder="Optional" />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Entry Paid</Text>
        <Switch value={entryPaid} onValueChange={setEntryPaid} />
      </View>

      <Pressable style={styles.button} onPress={() => void handleSubmit()} disabled={createPlayer.isPending}>
        <Text style={styles.buttonText}>{createPlayer.isPending ? 'Creating...' : 'Create Player'}</Text>
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
