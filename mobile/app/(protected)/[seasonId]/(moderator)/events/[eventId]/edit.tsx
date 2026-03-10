import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEvent } from '../../../../../../src/hooks/useEvent';
import { useUpdateEvent } from '../../../../../../src/hooks/useUpdateEvent';
import { LoadingSpinner } from '../../../../../../src/components/LoadingSpinner';

export default function EditEventScreen() {
  const { seasonId, eventId } = useLocalSearchParams<{ seasonId: string; eventId: string }>();
  const { data: event, isLoading } = useEvent(eventId!);
  const updateEvent = useUpdateEvent(seasonId!, eventId!);

  const [notes, setNotes] = useState('');
  const [ctpPerPlayer, setCtpPerPlayer] = useState('');
  const [acePerPlayer, setAcePerPlayer] = useState('');

  useEffect(() => {
    if (event) {
      setNotes(event.notes ?? '');
      setCtpPerPlayer(String(event.ctpPerPlayer ?? ''));
      setAcePerPlayer(String(event.acePerPlayer ?? ''));
    }
  }, [event]);

  async function handleSubmit() {
    try {
      await updateEvent.mutateAsync({
        notes: notes || undefined,
        ctpPerPlayer: ctpPerPlayer ? Number(ctpPerPlayer) : undefined,
        acePerPlayer: acePerPlayer ? Number(acePerPlayer) : undefined,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update event');
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Event</Text>
      <Text style={styles.subtitle}>{event?.name}</Text>

      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Optional" multiline />

      <Text style={styles.label}>CTP Per Player ($)</Text>
      <TextInput style={styles.input} value={ctpPerPlayer} onChangeText={setCtpPerPlayer} keyboardType="numeric" />

      <Text style={styles.label}>Ace Per Player ($)</Text>
      <TextInput style={styles.input} value={acePerPlayer} onChangeText={setAcePerPlayer} keyboardType="numeric" />

      <Pressable style={styles.button} onPress={handleSubmit} disabled={updateEvent.isPending}>
        <Text style={styles.buttonText}>{updateEvent.isPending ? 'Saving...' : 'Save Changes'}</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
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
});
