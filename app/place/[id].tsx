/**
 * FILE: app/place/[id].tsx
 * PURPOSE: Stub place-detail screen. Sprint 7 mobile parity scaffolds the
 *   route so saved-screen rows can navigate here. Real card UI ships with the
 *   PlaceCard mobile parity sprint.
 */
import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { colors, spacing, typography } from '../../lib/tokens'

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Place</Text>
      <Text style={styles.body}>id: {String(id)}</Text>
      <Text style={styles.body}>Detail UI ships in the PlaceCard mobile sprint.</Text>
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
    marginBottom: spacing.xs,
  },
})
