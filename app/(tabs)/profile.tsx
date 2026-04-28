/**
 * FILE: app/(tabs)/profile.tsx
 * PURPOSE: Stub for the mobile profile screen. Real account management lands
 *   with the auth screens in a follow-up sprint. Sprint 7 mobile parity only
 *   requires the saved screen.
 */
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '../../lib/tokens'

export default function ProfileScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>Account settings ship after the saved flow.</Text>
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
