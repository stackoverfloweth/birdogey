import { View, Text, StyleSheet } from 'react-native'
import { useSeason } from '@/contexts/SeasonContext'

export default function HomeScreen(): React.ReactNode {
  const { selectedSeason } = useSeason()

  return (
    <View style={styles.container}>
      <Text>
        {selectedSeason?.course.name}
      </Text>
      <Text>
        {selectedSeason?.name}
      </Text>
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
    marginBottom: 10,
  },
})
