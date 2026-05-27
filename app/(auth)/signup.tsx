/**
 * FILE: app/(auth)/signup.tsx
 * PURPOSE: Account creation screen. Email, display name, password.
 *   Brevo sends confirmation email via Supabase Auth SMTP settings.
 *   On success, routes to email confirmation waiting screen.
 * DEPENDS ON: lib/supabase.ts, lib/tokens.ts
 * USED BY: app/(auth)/_layout.tsx. Login screen link.
 * IF SOMETHING BREAKS HERE: Check Supabase Auth SMTP settings point to Brevo.
 *   Check email confirmation is enabled in Supabase Auth settings.
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
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { getSupabaseClient } from '../../lib/supabase';
import { colors, spacing, typography } from '../../lib/tokens';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSignup = async () => {
    if (!email || !displayName || !password) {
      Alert.alert('Missing fields', 'Fill in all three fields to continue.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password too short', 'Use at least 8 characters.');
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          onboarding_completed: false,
        },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        Alert.alert('Account exists', 'Try signing in instead.');
      } else {
        Alert.alert('Something went wrong', 'Try again in a moment.');
      }
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.headline}>Check your email.</Text>
          <Text style={styles.subline}>
            We sent a confirmation link to {email}. Click it to activate your account.
          </Text>
          <Text style={styles.footnote}>
            Check your spam folder if it does not arrive within a few minutes.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.headline}>Create your account.</Text>
        <Text style={styles.subline}>Travel like you belong everywhere.</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Display name"
            placeholderTextColor={colors.lBody}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            accessibilityLabel="Display name"
          />

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
            placeholder="Password (8+ characters)"
            placeholderTextColor={colors.lBody}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
            accessibilityLabel="Password"
          />

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Create account"
          >
            {loading
              ? <ActivityIndicator color={colors.forestDeep} />
              : <Text style={styles.buttonText}>Create account</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.footerLink}>
            Sign in.
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
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
  footnote: {
    fontSize: typography.caption,
    color: colors.lBody,
    marginTop: spacing.xl,
    textAlign: 'center',
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
