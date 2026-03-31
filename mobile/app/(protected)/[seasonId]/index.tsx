import { View, Text, StyleSheet } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useSeason } from '@/contexts/SeasonContext'

export default function HomeScreen(): React.ReactNode {
  const { seasonId } = useLocalSearchParams<{ seasonId: string }>()
  const { availableSeasons } = useSeason()
  const season = availableSeasons.find((s) => s.id === seasonId)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{season?.name ?? 'Home'}</Text>
      <Text style={styles.subtitle}>{season?.course.name}</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
})
