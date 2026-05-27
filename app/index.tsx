/**
 * FILE: app/index.tsx
 * PURPOSE: App entry point. Routes based on auth state.
 *   Mobile is always hard-gated. Auth before map. No exceptions.
 * DEPENDS ON: lib/auth-context.tsx for useAuth hook.
 * USED BY: Expo Router as the root index route.
 * IF SOMETHING BREAKS HERE: Check AuthProvider is in _layout.tsx.
 *   Check that onboarding_completed is correctly read from user_metadata.
 */

import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../lib/auth-context';
import { colors } from '../lib/tokens';

export default function Index() {
  const { session, loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator color={colors.deepForest} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  const onboardingComplete = user?.user_metadata?.onboarding_completed === true;
  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)/map" />;
}
