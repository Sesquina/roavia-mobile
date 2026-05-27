/**
 * FILE: lib/supabase.ts
 * PURPOSE: Single Supabase client for the mobile app. Every screen and hook
 *   imports from here via getSupabaseClient(). Never call createClient() directly.
 *   Sessions persist via expo-secure-store, NOT AsyncStorage — tokens are secrets.
 * DEPENDS ON:
 *   - @supabase/supabase-js
 *   - expo-secure-store — iOS Keychain / Android Keystore backed
 *   - EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (EAS env or .env local)
 * USED BY: every screen that touches Supabase — saved.tsx, map.tsx, auth screens.
 * IF SOMETHING BREAKS HERE:
 *   - "Cannot read property of undefined" on first launch: env vars not set —
 *     check eas secrets list / your local .env file.
 *   - Sessions don't persist across restarts: SecureStore returned null —
 *     check bundle id matches keychain entry created at signup.
 */
import 'react-native-url-polyfill/auto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
    const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''
    _client = createClient(url, anonKey, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  }
  return _client;
}

// Backward-compat export — Sprint 7 screens import { supabase } directly.
// New code should use getSupabaseClient() instead.
export const supabase = getSupabaseClient();
