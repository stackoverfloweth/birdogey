import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, Switch, Alert } from 'react-native'
import { router, useGlobalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { createPlayerApi, type Player } from '@birdogey/shared'
import { useUpdatePlayer } from '@/hooks/useUpdatePlayer'
import { queryKeys } from '@/hooks/queryKeys'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function EditPlayerScreen(): React.ReactNode {
  const { playerId } = useGlobalSearchParams<{ seasonId: string, playerId: string }>()
  const { apiClient } = useAuth()
  const playerApi = createPlayerApi(apiClient)

  const { data: player, isLoading } = useQuery({
    queryKey: queryKeys.players.detail(playerId),
    queryFn: () => playerApi.getById(playerId),
  })

  if (isLoading) return <LoadingSpinner />
  if (!player) return null

  return <EditPlayerForm player={player} />
}

function EditPlayerForm({ player }: { player: Player }): React.ReactNode {
  const { seasonId, playerId } = useGlobalSearchParams<{ seasonId: string, playerId: string }>()
  const updatePlayer = useUpdatePlayer(seasonId)

  const [name, setName] = useState(player.name)
  const [tagId, setTagId] = useState(String(player.tagId))
  const [udiscId, setUdiscId] = useState(player.udiscId ?? '')
  const [entryPaid, setEntryPaid] = useState(player.entryPaid ?? false)

  async function handleSubmit(): Promise<void> {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }

    try {
      await updatePlayer.mutateAsync({
        playerId: playerId,
        name: name.trim(),
        tagId: Number(tagId),
        udiscId: udiscId || undefined,
        entryPaid,
      })
      router.back()
    } catch {
      Alert.alert('Error', 'Failed to update player')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Tag ID</Text>
      <TextInput style={styles.input} value={tagId} onChangeText={setTagId} keyboardType="numeric" />

      <Text style={styles.label}>UDisc ID</Text>
      <TextInput style={styles.input} value={udiscId} onChangeText={setUdiscId} placeholder="Optional" />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Entry Paid</Text>
        <Switch value={entryPaid} onValueChange={setEntryPaid} />
      </View>

      <Pressable style={styles.button} onPress={() => void handleSubmit()} disabled={updatePlayer.isPending}>
        <Text style={styles.buttonText}>{updatePlayer.isPending ? 'Saving...' : 'Save Changes'}</Text>
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
