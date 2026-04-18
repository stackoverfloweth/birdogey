import { StyleSheet, View, Text } from 'react-native'

export default function Players(): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text>Players</Text>
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
