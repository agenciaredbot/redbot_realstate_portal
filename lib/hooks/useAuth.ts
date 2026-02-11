'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/admin';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAgent: boolean;
}

export function useAuth() {
  const router = useRouter();
  // Use singleton client to maintain session across renders
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    isAgent: false,
  });

  // Fetch user profile
  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      try {
        console.log('[useAuth] Fetching profile for user:', userId);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          // PGRST116 means no rows returned - profile doesn't exist yet
          if (error.code === 'PGRST116') {
            console.log('[useAuth] Profile not found for user, may need to create one');
            return null;
          }
          console.error('[useAuth] Error fetching profile:', error.message, error.code);
          return null;
        }

        console.log('[useAuth] Profile fetched successfully:', profile?.email);
        return profile as Profile;
      } catch (err) {
        console.error('[useAuth] Unexpected error fetching profile:', err);
        return null;
      }
    },
    [supabase]
  );

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const profile = await fetchProfile(user.id);
          setAuthState({
            user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            isAdmin: profile?.role === 1,
            isAgent: profile?.role === 2 || profile?.role === 1,
          });
        } else {
          setAuthState({
            user: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
            isAgent: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          isAgent: false,
        });
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: { user: User } | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuthState({
          user: session.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: profile?.role === 1,
          isAgent: profile?.role === 2 || profile?.role === 1,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          isAgent: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign in
  const signIn = async (email: string, password: string) => {
    console.log('[useAuth] Starting sign in for:', email);
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[useAuth] Sign in error:', error.message);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { error };
      }

      console.log('[useAuth] Sign in successful, user:', data.user?.id);

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        console.log('[useAuth] Profile result:', profile ? 'found' : 'not found', 'is_active:', profile?.is_active);

        // Only check is_active if profile exists AND is explicitly false
        if (profile && profile.is_active === false) {
          console.log('[useAuth] Account is inactive, signing out');
          await supabase.auth.signOut();
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { error: { message: 'Tu cuenta está desactivada' } };
        }

        setAuthState({
          user: data.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: profile?.role === 1,
          isAgent: profile?.role === 2 || profile?.role === 1,
        });

        console.log('[useAuth] Auth state updated, isAuthenticated: true');
      }

      return { data };
    } catch (err) {
      console.error('[useAuth] Unexpected sign in error:', err);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { error: { message: 'Error inesperado al iniciar sesión' } };
    }
  };

  // Sign up
  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; phone?: string }
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login?verified=true`,
      },
    });

    setAuthState((prev) => ({ ...prev, isLoading: false }));

    if (error) {
      return { error };
    }

    return { data };
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });

    if (error) {
      return { error };
    }

    return { data };
  };

  // Sign out
  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (authState.user) {
      const profile = await fetchProfile(authState.user.id);
      setAuthState((prev) => ({
        ...prev,
        profile,
        isAdmin: profile?.role === 1,
        isAgent: profile?.role === 2 || profile?.role === 1,
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };
}

// Hook for role-based access
export function useRequireRole(requiredRole: 1 | 2 | 3) {
  const { profile, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && profile) {
      // Admin can access everything
      if (profile.role === 1) return;

      // Check if user has required role or higher
      if (profile.role > requiredRole) {
        router.push('/admin/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, profile, requiredRole, router]);

  return { isLoading, hasAccess: profile?.role ? profile.role <= requiredRole : false };
}
