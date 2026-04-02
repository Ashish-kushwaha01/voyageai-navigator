import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  full_name: string | null;
  plan_type: "free" | "paid";
  credits: number;
  is_pro: boolean;
}

// Augment the User type to include our custom user_metadata
declare module "@supabase/supabase-js" {
  interface User {
    user_metadata: UserProfile;
  }
}

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  initError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    console.log("AuthContext: fetchUserProfile started for userId:", userId);
    const { data, error } = await getSupabase()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('AuthContext: Error fetching user profile:', error.message);
      console.log("AuthContext: fetchUserProfile finished with error.");
      return null;
    }
    console.log("AuthContext: fetchUserProfile finished successfully.");
    return data;
  };

  useEffect(() => {
    console.log("AuthContext: useEffect started.");
    let mounted = true;
    let supabase: ReturnType<typeof getSupabase>;
    try {
      supabase = getSupabase();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initialize Supabase.";
      setInitError(message);
      setIsLoading(false);
      console.error("AuthContext: Supabase initialization error:", message);
      return;
    }

    const processSession = async (currentSession: Session | null) => {
      console.log("AuthContext: processSession started with session:", currentSession ? "present" : "null");
      if (!mounted) {
        console.log("AuthContext: processSession aborted, component unmounted.");
        return;
      }

      if (currentSession?.user) {
        console.log("AuthContext: Session user found, fetching profile.");
        const profile = await fetchUserProfile(currentSession.user.id);
        if (profile) {
          const updatedUser = {
            ...currentSession.user,
            user_metadata: {
              ...currentSession.user.user_metadata,
              ...profile,
            },
          };
          currentSession = { ...currentSession, user: updatedUser };
          console.log("AuthContext: Profile merged into session user_metadata and new session object created.");
        } else {
          console.log("AuthContext: No profile found or error fetching profile.");
        }
      } else {
        console.log("AuthContext: No session user, skipping profile fetch.");
      }
      setSession(currentSession);
      setIsLoading(false);
      console.log("AuthContext: processSession finished, isLoading set to false.");
    };

    console.log("AuthContext: Calling supabase.auth.getSession().");
    supabase.auth.getSession().then(({ data, error }) => {
      console.log("AuthContext: supabase.auth.getSession() returned.");
      if (error) {
        console.error("AuthContext: Error getting session:", error.message);
        processSession(null);
      } else {
        processSession(data.session);
      }
    });

    console.log("AuthContext: Setting up onAuthStateChange listener.");
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      console.log("AuthContext: onAuthStateChange triggered with event:", _event, "nextSession:", nextSession ? "present" : "null");
      processSession(nextSession);
    });

    return () => {
      console.log("AuthContext: useEffect cleanup.");
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
        setIsLoading(true);
        const { error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          throw error;
        }
        // onAuthStateChange will handle setting session and isLoading
      },
      async signUp(email, password, fullName) {
        setIsLoading(true);
        const { error } = await getSupabase().auth.signUp({
          email,
          password,
          options: {
            data: fullName ? { full_name: fullName } : undefined,
          },
        });
        if (error) {
          setIsLoading(false);
          throw error;
        }
        // onAuthStateChange will handle setting session and isLoading
      },
      async signInWithGoogle() {
        setIsLoading(true);
        const { error } = await getSupabase().auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) {
          setIsLoading(false);
          throw error;
        }
        // onAuthStateChange will handle setting session and isLoading
      },
      async signOut() {
        setIsLoading(true);
        const { error } = await getSupabase().auth.signOut();
        if (error) {
          setIsLoading(false);
          throw error;
        }
        // onAuthStateChange will handle setting session to null and isLoading to false
      },
      fetchUserProfile: async () => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            const updatedUser = {
              ...session.user,
              user_metadata: {
                ...session.user.user_metadata,
                ...profile,
              },
            };
            setSession({ ...session, user: updatedUser });
          }
        }
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
