/**
 * FILE: app/(tabs)/saved.tsx
 * PURPOSE: Sprint 7 Slice 5 — mobile mirror of web /profile/saved. Shows the
 *   authed user's saved places grouped by collection (radar, tried, everyone,
 *   then custom by position). Tapping a row opens the place detail screen;
 *   tapping the unsave button optimistically removes the row and DELETEs the
 *   server row in the background.
 *
 *   Unlike the web page, this screen reads Supabase directly via the browser
 *   client (RLS-scoped to the authed user) instead of going through a Next.js
 *   API route — there is no Next API in mobile.
 * DEPENDS ON:
 *   - expo-router (Redirect, Link, useRouter)
 *   - lib/supabase — single Supabase client (SecureStore-backed session)
 *   - lib/tokens — every color/spacing/radius value
 *   - types — SavedPlace, Collection, Place shapes
 * USED BY: the (tabs) layout — appears as the "Saved" tab.
 * IF SOMETHING BREAKS HERE:
 *   - Always shows "Sign in" empty state: supabase.auth.getUser() returned
 *     null — the SecureStore session may be missing or the user logged out
 *     elsewhere.
 *   - Empty list when you know you have saves: RLS may be blocking SELECT —
 *     test the same query in supabase studio with the user's JWT.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import {
  CATEGORY_EMOJI,
  TIER_DISPLAY,
  colors,
  radii,
  spacing,
  typography,
} from '../../lib/tokens'
import type { Place } from '../../types'

// Local type for the Supabase JOIN result — collection returned as a nested object.
interface QueryCollection {
  id: string
  name: string
  type: string
  is_default: boolean
}

interface SavedPlaceRow {
  id: string
  place_id: string
  saved_at: string
  collection: QueryCollection | null
  place: Place | null
}

const COLLECTION_ORDER: Record<string, number> = {
  radar: 0,
  tried_it: 1,
  loved_it: 2,
  custom: 3,
}

interface CollectionGroup {
  collection: QueryCollection
  rows: SavedPlaceRow[]
}

/**
 * WHAT THIS DOES: Buckets saves by collection.id, then orders the buckets by
 *   collection.position so radar (0) renders before tried (1), everyone (2),
 *   and any custom collections (their stored position).
 * INPUTS: the raw saves from Supabase
 * RETURNS: ordered groups, ready for render
 * IF THIS BREAKS: a save with a missing collection join is silently skipped —
 *   confirm the SELECT below has `collection:collections(...)`.
 */
function groupByCollection(saves: SavedPlaceRow[]): CollectionGroup[] {
  const byId = new Map<string, CollectionGroup>()
  for (const row of saves) {
    if (!row.collection) continue
    const existing = byId.get(row.collection.id)
    if (existing) {
      existing.rows.push(row)
    } else {
      byId.set(row.collection.id, { collection: row.collection, rows: [row] })
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => (COLLECTION_ORDER[a.collection.type] ?? 99) - (COLLECTION_ORDER[b.collection.type] ?? 99)
  )
}

export default function SavedScreen() {
  const router = useRouter()

  const [authChecked, setAuthChecked] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [saves, setSaves] = useState<SavedPlaceRow[]>([])
  const [loading, setLoading] = useState(true)

  // One-shot auth check. We don't subscribe to auth changes here because the
  // tab is short-lived and the redirect on sign-out is handled at app level.
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const { data } = await supabase.auth.getUser()
      if (cancelled) return
      setUserId(data.user?.id ?? null)
      setAuthChecked(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Fetch saves once we know there's a user.
  useEffect(() => {
    if (!authChecked || !userId) return
    let cancelled = false
    setLoading(true)
    void (async () => {
      const { data } = await supabase
        .from('saved_places')
        .select(
          'id, place_id, saved_at, collection:collections(id, name, type, is_default), place:places(id, name, category, tier)'
        )
        .eq('user_id', userId)
        .order('saved_at', { ascending: false })
      if (cancelled) return
      setSaves((data as unknown as SavedPlaceRow[]) ?? [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [authChecked, userId])

  /**
   * WHAT THIS DOES: Removes the save optimistically and deletes the row server-
   *   side. Rolls back on failure.
   * INPUTS: place_id of the row to remove
   * IF THIS BREAKS: confirm the saved_places DELETE RLS policy lets the user
   *   delete their own rows.
   */
  const handleUnsave = useCallback(
    async (placeId: string) => {
      const previous = saves
      setSaves((prev) => prev.filter((s) => s.place_id !== placeId))
      const { error } = await supabase
        .from('saved_places')
        .delete()
        .eq('user_id', userId!)
        .eq('place_id', placeId)
      if (error) setSaves(previous)
    },
    [saves, userId]
  )

  const groups = useMemo(() => groupByCollection(saves), [saves])

  if (!authChecked) {
    return <SkeletonView />
  }
  if (!userId) {
    return <SignInEmptyState />
  }
  if (loading) {
    return <SkeletonView />
  }
  if (groups.length === 0) {
    return <NoSavesEmptyState />
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Text style={styles.title}>Saved</Text>
      <Text style={styles.subtitle}>Places you have collected so far.</Text>

      {groups.map((group) => (
        <View key={group.collection.id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{group.collection.name}</Text>
            <Text style={styles.sectionCount}>{group.rows.length}</Text>
          </View>
          {group.rows.map((row) =>
            row.place ? (
              <SavedRow
                key={row.id}
                place={row.place}
                onPress={() => router.push(`/place/${row.place!.id}`)}
                onUnsave={() => void handleUnsave(row.place!.id)}
              />
            ) : null
          )}
        </View>
      ))}
    </ScrollView>
  )
}

function SavedRow({
  place,
  onPress,
  onUnsave,
}: {
  place: Place
  onPress: () => void
  onUnsave: () => void
}) {
  const emoji = CATEGORY_EMOJI[place.category ?? ''] ?? '\u{1F4CD}'
  const tierLabel = place.tier ? TIER_DISPLAY[place.tier] : null
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <Text style={styles.emoji} accessibilityElementsHidden>
        {emoji}
      </Text>
      <View style={styles.rowBody}>
        <Text style={styles.rowName} numberOfLines={1}>
          {place.name}
        </Text>
        {tierLabel ? (
          <View style={[styles.tierBadge, tierBadgeTone(place.tier)]}>
            <Text style={[styles.tierBadgeText, tierBadgeTextTone(place.tier)]}>
              {tierLabel}
            </Text>
          </View>
        ) : null}
      </View>
      <Pressable
        onPress={(e) => {
          e.stopPropagation()
          onUnsave()
        }}
        style={({ pressed }) => [styles.unsaveBtn, pressed && styles.unsaveBtnPressed]}
        accessibilityLabel={`Unsave ${place.name}`}
      >
        <Text style={styles.unsaveBtnText}>Unsave</Text>
      </Pressable>
    </Pressable>
  )
}

function SkeletonView() {
  return (
    <View style={styles.page}>
      <View style={styles.pageContent}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
        <ActivityIndicator color={colors.brandGreen} style={{ marginTop: spacing.md }} />
      </View>
    </View>
  )
}

function SignInEmptyState() {
  return (
    <View style={[styles.page, styles.center]}>
      <Text style={styles.emptyEmoji}>{'\u{1F510}'}</Text>
      <Text style={styles.title}>Sign in to see your saves</Text>
      <Text style={styles.emptyCopy}>
        Saves sync to your account so they follow you across devices.
      </Text>
      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Sign in</Text>
        </Pressable>
      </Link>
    </View>
  )
}

function NoSavesEmptyState() {
  return (
    <View style={[styles.page, styles.center]}>
      <Text style={styles.emptyEmoji}>{'\u{1F4CD}'}</Text>
      <Text style={styles.title}>No saves yet</Text>
      <Text style={styles.emptyCopy}>
        Tap the heart on any place to start your first collection.
      </Text>
      <Link href="/(tabs)/map" asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Explore the map</Text>
        </Pressable>
      </Link>
    </View>
  )
}

function tierBadgeTone(tier: 'essential' | 'beloved' | 'gem' | null) {
  if (!tier) return { backgroundColor: colors.dark.border }
  return { backgroundColor: colors.tier[tier].bg }
}

function tierBadgeTextTone(tier: 'essential' | 'beloved' | 'gem' | null) {
  if (!tier) return { color: colors.dark.text }
  return { color: colors.tier[tier].text }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.dark.bg,
  },
  pageContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size['6xl'],
    fontWeight: typography.weight.bold,
    color: colors.dark.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.md,
    color: colors.dark.subtext,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  section: {
    backgroundColor: colors.dark.card,
    borderColor: colors.dark.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.semibold,
    color: colors.dark.text,
  },
  sectionCount: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.sm,
    color: colors.dark.subtext,
    fontWeight: typography.weight.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
  },
  rowPressed: {
    backgroundColor: colors.dark.border,
  },
  emoji: {
    fontSize: typography.size['4xl'],
    width: 32,
    textAlign: 'center',
  },
  rowBody: {
    flex: 1,
    marginLeft: spacing.sm,
    minWidth: 0,
  },
  rowName: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: colors.dark.text,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  tierBadgeText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
  },
  unsaveBtn: {
    minHeight: 36,
    minWidth: 64,
    paddingHorizontal: spacing.md,
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unsaveBtnPressed: {
    backgroundColor: colors.orange,
  },
  unsaveBtnText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.orange,
  },
  skeletonHeader: {
    height: 28,
    width: 140,
    borderRadius: radii.sm,
    backgroundColor: colors.dark.border,
    marginBottom: spacing.lg,
  },
  skeletonCard: {
    height: 96,
    borderRadius: radii.lg,
    backgroundColor: colors.dark.card,
    borderColor: colors.dark.border,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyCopy: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.md,
    color: colors.dark.subtext,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    maxWidth: 360,
  },
  cta: {
    height: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.brandGreen,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.forestDark,
  },
})
