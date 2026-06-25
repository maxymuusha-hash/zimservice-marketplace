import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/lib/trpc";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session && options?.redirectOnUnauthenticated) {
      window.location.href = "/auth";
    }
  }, [loading, session, options?.redirectOnUnauthenticated]);

  const { data: dbUser } = trpc.auth.me.useQuery(undefined, {
    enabled: !!session,
  });

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    window.location.href = "/";
  };

  return {
    user: dbUser ?? null,
    loading: loading || (!!session && dbUser === undefined),
    isAuthenticated: !!session,
    logout,
    refresh: () => {},
  };
}
