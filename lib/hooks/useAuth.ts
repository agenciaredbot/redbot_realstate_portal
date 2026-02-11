'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
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
  const supabase = createBrowserSupabaseClient();

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
    async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profile as Profile;
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
        setAuthState((prev) => ({ ...prev, isLoading: false }));
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
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { error };
    }

    if (data.user) {
      const profile = await fetchProfile(data.user.id);

      if (!profile?.is_active) {
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
    }

    return { data };
  };

  // Sign out
  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await supabase.auth.signOut();
    router.push('/admin/login');
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
      router.push('/admin/login');
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
