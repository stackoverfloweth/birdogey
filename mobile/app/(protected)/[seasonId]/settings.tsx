import { useAuth } from '@/contexts/AuthContext'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function SettingsScreen(): React.ReactNode {
  const { logout } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.row} onPress={() => void logout()}>
          <Text style={styles.rowLabel}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  row: {
    paddingVertical: 12,
  },
  rowLabel: { fontSize: 16 },
})
