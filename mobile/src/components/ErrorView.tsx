import { View, Text, Pressable, StyleSheet } from 'react-native'

interface Props {
  message?: string,
  onRetry?: () => void,
}

function RetryButton({ onRetry }: { onRetry: () => void }): React.ReactNode {
  return (
    <Pressable style={styles.button} onPress={onRetry}>
      <Text style={styles.buttonText}>Retry</Text>
    </Pressable>
  )
}

export function ErrorView({ message = 'Something went wrong', onRetry }: Props): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <RetryButton onRetry={onRetry} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})
