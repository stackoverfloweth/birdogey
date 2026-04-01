import { useAuth } from '@/contexts/AuthContext'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'

export default function SettingsScreen(): React.ReactNode {
  const { logout } = useAuth()

  return (
    <View style={styles.container}>
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
    paddingHorizontal: 16,
  },
  row: {
    paddingVertical: 12,
  },
  rowLabel: { fontSize: 16 },
})
