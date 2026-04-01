import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let supabase: ReturnType<typeof getSupabase>;
    try {
      supabase = getSupabase();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initialize Supabase.";
      setInitError(message);
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setSession(null);
      } else {
        setSession(data.session);
        if (data.session?.user) {
          createOrUpdateUserProfile(data.session.user);
        }
      }
      setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        createOrUpdateUserProfile(nextSession.user);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const createOrUpdateUserProfile = async (user: User) => {
    const { error } = await getSupabase()
      .from('profiles')
      .upsert(
        { id: user.id, full_name: user.user_metadata?.full_name || null },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error creating/updating user profile:', error.message);
    } else {
      console.log('User profile created/updated for:', user.id);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      initError,
      async signIn(email, password) {
        const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          await createOrUpdateUserProfile(data.user);
        }
      },
      async signUp(email, password, fullName) {
        const { error } = await getSupabase().auth.signUp({
          email,
          password,
          options: {
            data: fullName ? { full_name: fullName } : undefined,
          },
        });
        if (error) throw error;
      },
      async signInWithGoogle() {
        const { error } = await getSupabase().auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      },
      async signOut() {
        const { error } = await getSupabase().auth.signOut();
        if (error) throw error;
      },
    }),
    [initError, isLoading, session],
  );

  if (initError) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-md text-center space-y-3">
            <h1 className="font-display text-xl font-semibold">Supabase configuration</h1>
            <p className="text-sm text-muted-foreground">{initError}</p>
            <p className="text-xs text-muted-foreground">
              Add <code className="text-foreground">VITE_SUPABASE_URL</code> and{" "}
              <code className="text-foreground">VITE_SUPABASE_ANON_KEY</code> to <code className="text-foreground">.env</code>, then restart{" "}
              <code className="text-foreground">npm run dev</code>.
            </p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
