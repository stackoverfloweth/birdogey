import { colors } from '@/theme/colors'
import { Tabs } from 'expo-router'
import { SymbolView } from 'expo-symbols'

export default function ProtectedLayout(): React.ReactNode {
  return (
    <>
      <Tabs screenOptions={{
        title: 'Birdogey',
        headerShown: true,
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
            tabBarIcon: ({ color }) => (
              <SymbolView name="house.fill" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="Events"
          options={{
            tabBarLabel: 'Events',
            tabBarIcon: ({ color }) => (
              <SymbolView name="calendar" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="Players"
          options={{
            tabBarLabel: 'Players',
            tabBarIcon: ({ color }) => (
              <SymbolView name="person.2.fill" tintColor={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => (
              <SymbolView name="gearshape.fill" tintColor={color} size={28} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
