/**
 * FILE: lib/supabase.ts
 * PURPOSE: Single Supabase client for the mobile app. Mirrors the web's "one
 *   client only" rule — every screen and hook imports from here, never calls
 *   createClient() directly. Sessions persist via expo-secure-store, NOT
 *   AsyncStorage, because access/refresh tokens count as secrets.
 * DEPENDS ON:
 *   - @supabase/supabase-js
 *   - expo-secure-store — secure key/value backed by iOS Keychain / Android
 *     Keystore; never write tokens to plain AsyncStorage.
 *   - EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in the runtime
 *     env (eas secrets:create at build time, .env locally)
 * USED BY: every screen that touches Supabase data — saved.tsx, map.tsx,
 *   profile.tsx, the auth flow.
 * IF SOMETHING BREAKS HERE:
 *   - "Cannot read property of undefined" on first launch: the env vars aren't
 *     set — check eas secrets list / your local .env file.
 *   - Sessions don't persist across app restarts: SecureStore returned null —
 *     check that the bundle id matches the keychain entry created at signup.
 */
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
