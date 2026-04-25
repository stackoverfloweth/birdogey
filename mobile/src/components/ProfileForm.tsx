import { Text, View, StyleSheet } from 'react-native'

export function ProfileForm(): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text>Profile Form</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})
