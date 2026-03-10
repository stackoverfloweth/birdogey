import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../src/contexts/AuthContext';
import { createPlayerApi } from '../../../../../../src/services/playerApi';
import { useUpdatePlayer } from '../../../../../../src/hooks/useUpdatePlayer';
import { queryKeys } from '../../../../../../src/hooks/queryKeys';
import { LoadingSpinner } from '../../../../../../src/components/LoadingSpinner';

export default function EditPlayerScreen() {
  const { seasonId, playerId } = useLocalSearchParams<{ seasonId: string; playerId: string }>();
  const { apiClient } = useAuth();
  const playerApi = createPlayerApi(apiClient);
  const updatePlayer = useUpdatePlayer(seasonId!);

  const { data: player, isLoading } = useQuery({
    queryKey: queryKeys.players.detail(playerId!),
    queryFn: () => playerApi.getPlayer(playerId!),
  });

  const [name, setName] = useState('');
  const [tagId, setTagId] = useState('');
  const [udiscId, setUdiscId] = useState('');
  const [entryPaid, setEntryPaid] = useState(false);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setTagId(String(player.tagId));
      setUdiscId(player.udiscId ?? '');
      setEntryPaid(player.entryPaid ?? false);
    }
  }, [player]);

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      await updatePlayer.mutateAsync({
        playerId: playerId!,
        name: name.trim(),
        tagId: Number(tagId),
        udiscId: udiscId || undefined,
        entryPaid,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update player');
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Player</Text>

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

      <Pressable style={styles.button} onPress={handleSubmit} disabled={updatePlayer.isPending}>
        <Text style={styles.buttonText}>{updatePlayer.isPending ? 'Saving...' : 'Save Changes'}</Text>
      </Pressable>
    </View>
  );
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
});
