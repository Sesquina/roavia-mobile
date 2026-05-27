/**
 * FILE: lib/tokens.ts
 * PURPOSE: Mirror of web src/lib/tokens.ts. Same color values, same names so
 *   product designers can think in one design system across web and mobile.
 *   Sprint 7 mobile parity — every color, spacing, radius, font value used in
 *   any screen MUST come from this file. Zero hex string literals in components.
 * DEPENDS ON: nothing (pure constants, no React or RN imports)
 * USED BY: every screen and component in roavia-mobile
 * IF SOMETHING BREAKS HERE:
 *   - Color drift between web and mobile: confirm web src/lib/tokens.ts has the
 *     same values; the two files must be kept in lockstep until they share a
 *     real package (post-launch refactor).
 *   - "X is not a property of colors": you may be looking at the web nested
 *     shape (colors.dark.bg) — mobile uses the same nested shape; check spelling.
 */

export const colors = {
  // Brand
  cream: '#FEFBF6',
  brandGreen: '#8BFF99',
  deepForest: '#06574E',
  forestDark: '#044038',
  emerald: '#00BE7C',
  orange: '#FF4F06',

  // Tier badges
  tier: {
    essential: { bg: '#FEC035', text: '#3d2000', symbol: '★' },
    beloved: { bg: '#8BFF99', text: '#003d27', symbol: '♥' },
    gem: { bg: '#FF4F06', text: '#ffffff', symbol: '✨' },
  },

  // Dark mode
  dark: {
    bg: '#0F172A',
    card: '#1E293B',
    text: '#E2E8F0',
    subtext: '#94A3B8',
    border: '#334155',
    divider: '#1E293B',
  },

  // Light mode
  light: {
    bg: '#FEFBF6',
    card: '#ffffff',
    text: '#111827',
    subtext: '#6B7280',
    border: '#E5E7EB',
    divider: '#F0EDE6',
  },

  // Semantic
  open: '#10B981',
  closed: '#9CA3AF',
  error: '#EF4444',
  info: '#4285F4',

  // AAA-verified text + surface tokens (Sprint 00 addition — auth and map screens)
  forestDeep: '#052A26',
  darkBg: '#0F172A',
  darkCard: '#1E293B',
  darkBorder: '#334155',
  lPrimary: '#0f172a',
  lBody: '#334155',
  lOpen: '#035040',
  bookText: '#052A26',
  dPrimary: '#f1f5f9',
  dBody: '#E2E8F0',
  dSub: '#b8c4d0',
  dOpen: '#7dedbf',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  xxxl: 48,
} as const

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 20,
} as const

// Mirror of web typography — RN doesn't use the 'fontFamily: "Inter, sans-serif"'
// CSS string; we expose a font name and rely on the system stack until we wire
// expo-font + Inter (post-Sprint-7 polish). For sizes, use these numbers in
// React Native StyleSheet.
export const typography = {
  fontFamily: 'System',
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  } as const,
  size: {
    xs: 11,
    sm: 12,
    base: 13,
    md: 14,
    lg: 15,
    xl: 16,
    '2xl': 17,
    '3xl': 18,
    '4xl': 20,
    '5xl': 24,
    '6xl': 28,
    '7xl': 32,
  },
  // Flat size aliases (Sprint 00 addition — auth and map screens)
  display: 28,
  h1: 22,
  h2: 18,
  title: 15,
  body: 13,
  label: 11,
  caption: 10,
  micro: 9,
  button: 14,
} as const

export const CATEGORY_EMOJI: Record<string, string> = {
  'Restaurants & Food': '🍽️',
  'Bars & Nightlife': '🍸',
  'Coffee & Cafes': '☕',
  'Shops & Boutiques': '🛍️',
  'Wellness & Spas': '🧘',
  'Hotels & Stays': '🏨',
  Experiences: '🎟️',
  'Boat & Water': '⛵',
  'Arts & Culture': '🎨',
  Landmarks: '🏛️',
  Markets: '🏪',
  'Live Music': '🎵',
  'Local Guides & Tours': '🗺️',
  Transportation: '🚌',
}

export const TIER_DISPLAY: Record<string, string> = {
  essential: '✦ Essential',
  beloved: '♥ Beloved',
  gem: '✨ Find',
}

export const mapConfig = {
  defaultLng: -118.3617,
  defaultLat: 34.0900,
  defaultZoom: 13,
  lightStyle: 'mapbox://styles/mapbox/light-v11',
  darkStyle: 'mapbox://styles/mapbox/dark-v11',
} as const
