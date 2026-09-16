# SESSION LOG — roavia-mobile

## SESSION 2026-05-27
Branch: sprint/00-mobile-mapbox-foundation
TypeScript: zero errors
Tests: N/A — no automated mobile tests in this sprint
npm audit: 14 moderate severity vulnerabilities (pre-existing, no fix --force needed)

### Completed:
- expo-doctor fixes: metro.config.js created (was missing), expo-linking upgraded to 8.0.12, react-native-worklets upgraded to 0.5.1 — 18/18 checks pass
- babel.config.js created with react-native-reanimated/plugin last
- eas.json replaced with full development/preview/production profiles (PLACEHOLDER tokens intentional)
- app.json updated with @rnmapbox/maps plugin (RNMapboxMapsVersion: 11.18.2, no sk. or download token)
- @rnmapbox/maps, expo-auth-session, expo-web-browser installed
- lib/tokens.ts: additive Sprint 00 additions only — flat color aliases (lPrimary, lBody, etc.), mapConfig, flat typography aliases, spacing.xxxl. All Sprint 7 values preserved.
- lib/supabase.ts: refactored to getSupabaseClient() lazy singleton; export const supabase alias kept for backward compat with saved.tsx
- lib/auth-context.tsx: created — AuthProvider with getSession on mount + onAuthStateChange subscription
- types/index.ts: replaced stub with full Place type (all fields mirroring web), plus RoaviaMap, UserProfile, Collection (CollectionType), SavedPlace, ActiveFilters, Interaction
- app/_layout.tsx: updated — AuthProvider wraps Stack (replaces fragment + StatusBar)
- app/index.tsx: updated — auth-gated routing with loading spinner
- app/(auth)/_layout.tsx: created
- app/(auth)/login.tsx: real screen replacing stub — email/password, friendly error messages
- app/(auth)/signup.tsx: real screen replacing stub — email confirmation flow
- app/(tabs)/map.tsx: Mapbox scaffold replacing stub — setAccessToken + Camera at WeHo default
- app/(tabs)/saved.tsx: fixed to new Collection type — type-based ordering (radar→tried_it→loved_it→custom) replaces broken position-based ordering
- MOBILE_VERIFY.md: created with 4 manual steps and 8-check device checklist

### Human verification needed from Samira:
See MOBILE_VERIFY.md — 4 manual steps required before device testing is possible.

### What does NOT work yet:
- Map does not show markers (M-14 sprint)
- Filters not implemented (M-14 sprint)
- Apple OAuth not implemented (A-07 sprint)
- Google OAuth not implemented (A-07 sprint)
- Profile screen is still Sprint 7 stub
- Onboarding screen does not exist yet (referenced in routing, will 404 until A-07 sprint)

### Blockers:
Samira must complete 4 manual steps in MOBILE_VERIFY.md before device testing.

### Next session starts with:
```
cd ~/roavia-mobile && git checkout sprint/A-07-auth-oauth-mobile
```
