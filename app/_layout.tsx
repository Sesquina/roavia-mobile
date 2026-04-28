/**
 * FILE: app/_layout.tsx
 * PURPOSE: Expo Router root layout. Wraps every screen in a single Stack so
 *   nested groups (auth, tabs, place detail) inherit consistent navigation
 *   styling. Sprint 7 mobile parity — this is the entry point that replaces
 *   the deleted blank-template App.tsx.
 * DEPENDS ON:
 *   - expo-router (file-based routing)
 *   - expo-status-bar (status bar style)
 * USED BY: Expo Router auto-loads this file as the root.
 * IF SOMETHING BREAKS HERE:
 *   - "Cannot find native module RNCSafeAreaContext": run
 *     `npx expo install react-native-safe-area-context`
 *   - White flash on cold start: confirm splash backgroundColor matches
 *     dark.bg in app.json.
 */
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
