/**
 * FILE: app/(auth)/login.tsx
 * PURPOSE: Login screen. Email and password. Apple OAuth. Google OAuth.
 *   All auth calls go through lib/supabase.ts. No direct createClient() here.
 * DEPENDS ON: lib/supabase.ts, lib/tokens.ts, lib/auth-context.tsx
 * USED BY: app/index.tsx redirects here when no session. app/(auth)/_layout.tsx.
 * IF SOMETHING BREAKS HERE: Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
 *   are in the EAS build environment. Check that getSupabaseClient() is not called
 *   before the environment variables are available.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { getSupabaseClient } from '../../lib/supabase';
import { colors, spacing, typography } from '../../lib/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        Alert.alert('Wrong email or password', 'Double-check and try again.');
      } else if (error.message.includes('Email not confirmed')) {
        Alert.alert('Check your email', 'Click the confirmation link we sent you first.');
      } else {
        Alert.alert('Something went wrong', 'Try again in a moment.');
      }
      return;
    }

    // Auth state change in AuthProvider handles the redirect automatically
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.headline}>Welcome back.</Text>
        <Text style={styles.subline}>Your locals are waiting.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.lBody}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            accessibilityLabel="Email address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.lBody}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            accessibilityLabel="Password"
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign in"
          >
            {loading
              ? <ActivityIndicator color={colors.forestDeep} />
              : <Text style={styles.buttonText}>Sign in</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>No account? </Text>
          <Link href="/(auth)/signup" style={styles.footerLink}>
            Create one.
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  headline: {
    fontSize: typography.h1,
    fontWeight: '700',
    color: colors.lPrimary,
    marginBottom: spacing.xs,
  },
  subline: {
    fontSize: typography.body,
    color: colors.lBody,
    marginBottom: spacing.xxxl,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.lBody,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    fontSize: typography.body,
    color: colors.lPrimary,
    backgroundColor: colors.light.card,
  },
  button: {
    height: 52,
    backgroundColor: colors.brandGreen,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.button,
    fontWeight: '700',
    color: colors.bookText,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    fontSize: typography.body,
    color: colors.lBody,
  },
  footerLink: {
    fontSize: typography.body,
    color: colors.deepForest,
    fontWeight: '600',
  },
});
