// src/context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = {
    supabase,
    user,
    initializing,
    loading: initializing, // if you use `loading` elsewhere
    signOut: () => supabase.auth.signOut(),
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({ provider: "google" }),
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
