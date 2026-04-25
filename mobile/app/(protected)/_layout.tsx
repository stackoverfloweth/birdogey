import { colors } from '@/theme/colors'
import { useAuth } from '@/contexts/AuthContext'
import { Redirect, Tabs } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { ActivityIndicator, View } from 'react-native'

export default function ProtectedLayout(): React.ReactNode {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }

  return (
    <>
      <Tabs screenOptions={{
        title: 'Birdogey',
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTitleStyle: {
          fontFamily: 'Ephesis',
          fontSize: 32,
          fontWeight: 'normal',
          color: colors.primary_500,
        },
      }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Home',
            tabBarActiveTintColor: colors.primary_500,
            tabBarIcon: ({ color }) => (
              <SymbolView name="house.fill" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            tabBarLabel: 'Events',
            tabBarActiveTintColor: colors.primary_500,
            tabBarIcon: ({ color }) => (
              <SymbolView name="calendar" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="players"
          options={{
            tabBarLabel: 'Players',
            tabBarActiveTintColor: colors.primary_500,
            tabBarIcon: ({ color }) => (
              <SymbolView name="person.2.fill" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarActiveTintColor: colors.primary_500,
            tabBarIcon: ({ color }) => (
              <SymbolView name="gearshape.fill" tintColor={color} size={28} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
