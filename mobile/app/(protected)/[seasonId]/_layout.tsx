import { router, Stack } from 'expo-router'
import { Alert } from 'react-native'

export default function SeasonLayout(): React.ReactNode {
  return (
    <>
      <Stack.Screen.Title>Home</Stack.Screen.Title>

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="chevron.left"
          hidesSharedBackground
          onPress={() => router.back()}
        />

        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button icon="plus" onPress={() => Alert.alert('Add')}>
            Add
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      </Stack.Toolbar>

      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
