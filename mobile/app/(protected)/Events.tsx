import { StyleSheet, View, Text } from 'react-native'

export default function Events(): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text>Events</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
