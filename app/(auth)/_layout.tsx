/**
 * FILE: app/(auth)/_layout.tsx
 * PURPOSE: Navigation layout for the auth flow screens (login, signup, onboarding).
 * DEPENDS ON: expo-router Stack.
 * USED BY: Expo Router for the (auth) route group.
 * IF SOMETHING BREAKS HERE: Check that all auth screen files exist in app/(auth)/.
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
