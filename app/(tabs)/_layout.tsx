import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{
                title: "Wallet", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="wallet" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="swap" options={{
                title: "Swap", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="swap-horizontal" size={size} color={color} />
                ),
            }} />
            <Tabs.Screen name="setting" options={{
                title: "Setting", tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings" size={size} color={color} />
                ),
            }} />
        </Tabs>
    )
}
