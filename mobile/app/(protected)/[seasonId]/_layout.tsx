import { Tabs } from 'expo-router'
import { SymbolView } from 'expo-symbols'

export default function SeasonLayout(): React.ReactNode {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView name="house" tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => (
            <SymbolView name="calendar" tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: 'Players',
          tabBarIcon: ({ color }) => (
            <SymbolView name="person.2" tintColor={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView name="gearshape" tintColor={color} size={28} />
          ),
        }}
      />
    </Tabs>
  )
}
