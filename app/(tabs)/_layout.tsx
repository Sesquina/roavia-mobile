/**
 * FILE: app/(tabs)/_layout.tsx
 * PURPOSE: Bottom tab bar for the three primary screens — Map, Saved, Profile.
 *   Tab labels and active color come from tokens for design parity with web.
 *   Sprint 7 mobile parity.
 * DEPENDS ON:
 *   - expo-router Tabs
 *   - lib/tokens — accent and surface colors
 * IF SOMETHING BREAKS HERE: each tab needs a real screen file in this dir
 *   (map.tsx, saved.tsx, profile.tsx) — missing screens disable that tab.
 */
import { Tabs } from 'expo-router'
import { colors } from '../../lib/tokens'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark.card,
          borderTopColor: colors.dark.border,
        },
        tabBarActiveTintColor: colors.brandGreen,
        tabBarInactiveTintColor: colors.dark.subtext,
      }}
    >
      <Tabs.Screen name="map" options={{ title: 'Map' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
