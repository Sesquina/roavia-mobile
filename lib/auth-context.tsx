/**
 * FILE: lib/auth-context.tsx
 * PURPOSE: Shared auth state for all screens in the mobile app.
 *   Every screen reads auth from this context. No screen calls supabase.auth.getUser() independently.
 * DEPENDS ON: lib/supabase.ts for the Supabase client.
 * USED BY: app/_layout.tsx (wraps the entire app). Every screen that needs auth state.
 * IF SOMETHING BREAKS HERE: Check that AuthProvider wraps the Stack in app/_layout.tsx.
 *   Check that lib/supabase.ts exports getSupabaseClient correctly.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
