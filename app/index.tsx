/**
 * FILE: app/index.tsx
 * PURPOSE: App root route. Routes the user to the tabbed home depending on
 *   auth state (later) or shows a launch placeholder. Sprint 7 mobile parity —
 *   for now this just redirects to /(tabs)/saved so the saved screen is the
 *   first thing testers see.
 * IF SOMETHING BREAKS HERE: confirm app/(tabs)/_layout.tsx exists; otherwise
 *   the redirect target is unreachable and Expo Router throws "Unmatched Route".
 */
import { Redirect } from 'expo-router'

export default function Index() {
  return <Redirect href="/(tabs)/saved" />
}
