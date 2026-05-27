# MOBILE_VERIFY — sprint/00-mobile-mapbox-foundation

Sprint: sprint/00-mobile-mapbox-foundation
Status: BUILT — awaiting Samira's 4 manual steps and device verification

## WHAT CLAUDE CODE BUILT

- metro.config.js extending expo/metro-config (expo-doctor fix)
- babel.config.js with react-native-reanimated/plugin
- eas.json with development, preview, and production profiles
- app.json updated with @rnmapbox/maps plugin (RNMapboxMapsVersion: 11.18.2, no hardcoded token)
- lib/tokens.ts — existing Sprint 7 tokens preserved + new flat aliases added for auth/map screens
- types/index.ts — full Place type mirroring web, all shared types (Collection, SavedPlace, UserProfile, ActiveFilters, Interaction)
- lib/supabase.ts — refactored to getSupabaseClient() pattern; supabase alias kept for Sprint 7 screens
- lib/auth-context.tsx — AuthProvider with real Supabase session management
- app/_layout.tsx — AuthProvider wrapping the Stack
- app/index.tsx — auth-gated routing (no session → login, no onboarding → onboarding, done → map)
- app/(auth)/_layout.tsx — auth group navigation layout
- app/(auth)/login.tsx — real login screen replacing stub
- app/(auth)/signup.tsx — real signup screen replacing stub
- app/(tabs)/map.tsx — Mapbox scaffold replacing stub
- app/(tabs)/saved.tsx — updated to use new Collection type (type-based ordering replaces position-based)

## WHAT SAMIRA MUST DO BEFORE THIS CAN BE TESTED

### STEP A — Set your Mapbox public token in eas.json
Replace all three `PLACEHOLDER_REPLACE_WITH_PK_TOKEN` values in eas.json with your real
Mapbox public token. It MUST start with `pk.` — never `sk.`

### STEP B — Set Supabase env vars in EAS
```
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value <your-url>
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <your-anon-key>
```

### STEP C — Trigger an EAS development build
```
eas build --platform all --profile development
```
This will take 10–20 minutes per platform. Mapbox SDK is fetched during the native build.

### STEP D — Install development client on device
- iOS: scan the QR code from the EAS dashboard or install the .ipa via TestFlight
- Android: install the .apk directly from the EAS build page

Note: @rnmapbox/maps does NOT work in Expo Go. You MUST use the EAS development client.

## VERIFICATION CHECKLIST (run after installing development client)

- [ ] App launches without crash
- [ ] Login screen appears (not the old placeholder stub)
- [ ] Can create account with email — confirmation email arrives
- [ ] Can log in with existing account
- [ ] After login, app routes to map screen
- [ ] Map loads — Mapbox tiles visible within 3 seconds (not a white screen)
- [ ] No crash on map screen
- [ ] Kill app. Reopen. Still logged in (session persists via expo-secure-store)

PASS: All 8 checks green — mark sprint/00-mobile-mapbox-foundation as DONE
FAIL: Note which check failed and file a BLOCKED.md
