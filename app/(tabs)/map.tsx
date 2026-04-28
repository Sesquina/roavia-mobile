/**
 * FILE: app/(tabs)/map.tsx
 * PURPOSE: Stub for the mobile map screen. Real implementation lands with
 *   the @rnmapbox/maps integration in a follow-up sprint; for Sprint 7 mobile
 *   parity we only need the saved screen wired end-to-end.
 */
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, typography } from '../../lib/tokens'

export default function MapScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.body}>
        The mobile map ships in the @rnmapbox/maps integration sprint.
      </Text>
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
