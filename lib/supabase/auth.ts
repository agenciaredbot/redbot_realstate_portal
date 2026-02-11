import { createServerSupabaseClient } from './server';
import { createBrowserSupabaseClient } from './client';
import type { Profile, UserRole, USER_ROLES } from '@/types/admin';

// =====================================================
// SERVER-SIDE AUTH FUNCTIONS
// =====================================================

/**
 * Get the current authenticated user from server
 */
export async function getUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current user's profile with role
 */
export async function getUserProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile as Profile;
}

/**
 * Get user profile with linked agent data (for agent users)
 */
export async function getUserProfileWithAgent() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      agent:agents(
        id,
        slug,
        first_name,
        last_name,
        photo_url
      )
    `
    )
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile with agent:', error);
    return null;
  }

  return profile;
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile) return false;

  // Admin has access to everything
  if (profile.role === 1) return true;

  return profile.role === requiredRole;
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === 1;
}

/**
 * Check if current user is agent
 */
export async function isAgent(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === 2 || profile?.role === 1;
}

/**
 * Sign out the current user (server-side)
 */
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

// =====================================================
// CLIENT-SIDE AUTH FUNCTIONS
// =====================================================

/**
 * Sign in with email and password (client-side)
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Sign up with email and password (client-side)
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string
) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return { data, error };
}

/**
 * Sign out (client-side)
 */
export async function signOutClient() {
  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session (client-side)
 */
export async function getSession() {
  const supabase = createBrowserSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Request password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  });

  return { data, error };
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string) {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
}

// =====================================================
// PROFILE MANAGEMENT
// =====================================================

/**
 * Update current user's profile (client-side)
 * @param userId - User ID (required when called from server)
 * @param updates - Profile fields to update
 */
export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createBrowserSupabaseClient();

  // Remove fields that shouldn't be updated by the user
  const safeUpdates = {
    full_name: updates.full_name,
    phone: updates.phone,
    avatar_url: updates.avatar_url,
  };

  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(file: File): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(filePath);

  // Update profile with new avatar URL
  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  return publicUrl;
}
