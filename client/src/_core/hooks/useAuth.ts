import { useState, useEffect } from "react";
import { supabase } from "@/supabase";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && options?.redirectOnUnauthenticated) {
      window.location.href = "/auth";
    }
  }, [loading, user, options?.redirectOnUnauthenticated]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refresh: () => {},
  };
}
