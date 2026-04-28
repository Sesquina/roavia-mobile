/**
 * FILE: app/(auth)/signup.tsx
 * PURPOSE: Stub signup screen. Same status as login — scaffolded so deep
 *   links resolve; real implementation in the auth-screens sprint.
 */
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '../../lib/tokens'

export default function SignupScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.body}>The signup form ships in the auth-screens sprint.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.dark.bg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size['6xl'],
    fontWeight: typography.weight.bold,
    color: colors.dark.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.md,
    color: colors.dark.subtext,
    textAlign: 'center',
  },
})
