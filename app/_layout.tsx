/**
 * FILE: app/_layout.tsx
 * PURPOSE: Root layout. Provides auth context to all screens.
 * DEPENDS ON: lib/auth-context.tsx for AuthProvider. expo-router for Stack.
 * USED BY: Expo Router — this is the root of the navigation tree.
 * IF SOMETHING BREAKS HERE: AuthProvider must wrap Stack. If auth breaks app-wide,
 *   check that AuthProvider is present and lib/supabase.ts is correctly initialized.
 */

import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/auth-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="place/[id]" />
      </Stack>
    </AuthProvider>
  );
}
