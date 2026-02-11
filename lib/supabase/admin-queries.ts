import { createServerSupabaseClient, createAdminClient } from './server';
import type {
  Profile,
  Notification,
  PropertyWithSubmission,
  ContactSubmissionWithDetails,
  AdminDashboardStats,
  AgentDashboardStats,
  UserDashboardStats,
  UserRole,
} from '@/types/admin';

// =====================================================
// PROFILE QUERIES
// =====================================================

/**
 * Get all profiles (admin only)
 */
export async function getAllProfiles(
  options: {
    role?: UserRole;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('profiles')
    .select(
      `
      *,
      agent:agents(id, first_name, last_name, photo_url)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (options.role) {
    query = query.eq('role', options.role);
  }

  if (typeof options.isActive === 'boolean') {
    query = query.eq('is_active', options.isActive);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching profiles:', error);
    return { profiles: [], total: 0 };
  }

  return { profiles: data as Profile[], total: count || 0 };
}

/**
 * Get profile by ID (admin only)
 */
export async function getProfileById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      agent:agents(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update profile role (admin only)
 */
export async function updateProfileRole(id: string, role: UserRole) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Deactivate/Activate profile (admin only)
 */
export async function toggleProfileActive(id: string, isActive: boolean) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Link profile to agent (admin only)
 */
export async function linkProfileToAgent(profileId: string, agentId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ agent_id: agentId, role: 2 }) // Role 2 = Agent
    .eq('id', profileId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// NOTIFICATION QUERIES
// =====================================================

/**
 * Get notifications for current user
 */
export async function getNotifications(userId: string, limit = 20) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data as Notification[];
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching notification count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  return { error };
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return { error };
}

// =====================================================
// PROPERTY QUERIES (Admin)
// =====================================================

/**
 * Get all properties with submission status (admin)
 */
export async function getAdminProperties(
  options: {
    submissionStatus?: 'pending' | 'approved' | 'rejected';
    isActive?: boolean;
    agentId?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('properties')
    .select(
      `
      id, title, slug, status, property_type, price, city,
      is_active, is_featured, submitted_by, submission_status,
      rejection_reason, agent_id, created_at, updated_at,
      submitter:profiles!submitted_by(id, full_name, email, avatar_url),
      agent:agents!agent_id(id, first_name, last_name, photo_url)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (options.submissionStatus) {
    query = query.eq('submission_status', options.submissionStatus);
  }

  if (typeof options.isActive === 'boolean') {
    query = query.eq('is_active', options.isActive);
  }

  if (options.agentId) {
    query = query.eq('agent_id', options.agentId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching admin properties:', error);
    return { properties: [], total: 0 };
  }

  // Transform the data to match PropertyWithSubmission type
  const transformedData = (data || []).map((item: Record<string, unknown>) => ({
    ...item,
    submitter: Array.isArray(item.submitter) ? item.submitter[0] : item.submitter,
    agent: Array.isArray(item.agent) ? item.agent[0] : item.agent,
  }));

  return { properties: transformedData as PropertyWithSubmission[], total: count || 0 };
}

/**
 * Get pending properties count
 */
export async function getPendingPropertiesCount() {
  const supabase = await createServerSupabaseClient();

  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('submission_status', 'pending');

  if (error) {
    console.error('Error fetching pending count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Approve property
 */
export async function approveProperty(propertyId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({
      submission_status: 'approved',
      is_active: true,
      rejection_reason: null,
    })
    .eq('id', propertyId)
    .select()
    .single();

  return { data, error };
}

/**
 * Reject property
 */
export async function rejectProperty(propertyId: string, reason: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({
      submission_status: 'rejected',
      is_active: false,
      rejection_reason: reason,
    })
    .eq('id', propertyId)
    .select()
    .single();

  return { data, error };
}

/**
 * Assign property to agent
 */
export async function assignPropertyToAgent(propertyId: string, agentId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ agent_id: agentId })
    .eq('id', propertyId)
    .select()
    .single();

  // TODO: Create notification for the agent

  return { data, error };
}

/**
 * Toggle property featured status
 */
export async function togglePropertyFeatured(propertyId: string, isFeatured: boolean) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ is_featured: isFeatured })
    .eq('id', propertyId)
    .select()
    .single();

  return { data, error };
}

/**
 * Toggle property active status
 */
export async function togglePropertyActive(propertyId: string, isActive: boolean) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ is_active: isActive })
    .eq('id', propertyId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// CONTACT SUBMISSIONS QUERIES
// =====================================================

/**
 * Get all contact submissions (admin)
 */
export async function getContactSubmissions(
  options: {
    status?: string;
    agentId?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('contact_submissions')
    .select(
      `
      *,
      property:properties(id, title, slug),
      agent:agents(id, first_name, last_name)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  if (options.status) {
    query = query.eq('status', options.status);
  }

  if (options.agentId) {
    query = query.eq('agent_id', options.agentId);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching contact submissions:', error);
    return { submissions: [], total: 0 };
  }

  return {
    submissions: data as ContactSubmissionWithDetails[],
    total: count || 0,
  };
}

/**
 * Update contact submission status
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
  notes?: string
) {
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { status };
  if (notes) updates.notes = notes;

  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', submissionId)
    .select()
    .single();

  return { data, error };
}

/**
 * Assign submission to agent
 */
export async function assignSubmissionToAgent(submissionId: string, agentId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ agent_id: agentId })
    .eq('id', submissionId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// DASHBOARD STATS
// =====================================================

/**
 * Get admin dashboard stats
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createServerSupabaseClient();

  // Total properties
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  // Active properties
  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  // Pending properties
  const { count: pendingProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('submission_status', 'pending');

  // Total agents
  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // Leads this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: leadsThisMonth } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  // Leads last month
  const startOfLastMonth = new Date();
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
  startOfLastMonth.setDate(1);
  startOfLastMonth.setHours(0, 0, 0, 0);

  const endOfLastMonth = new Date(startOfMonth);
  endOfLastMonth.setSeconds(-1);

  const { count: leadsLastMonth } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lt('created_at', startOfMonth.toISOString());

  const leadsChange =
    leadsLastMonth && leadsLastMonth > 0
      ? Math.round((((leadsThisMonth || 0) - leadsLastMonth) / leadsLastMonth) * 100)
      : 0;

  return {
    totalProperties: totalProperties || 0,
    activeProperties: activeProperties || 0,
    pendingProperties: pendingProperties || 0,
    totalAgents: totalAgents || 0,
    totalUsers: totalUsers || 0,
    leadsThisMonth: leadsThisMonth || 0,
    leadsLastMonth: leadsLastMonth || 0,
    leadsChange,
  };
}

/**
 * Get agent dashboard stats
 */
export async function getAgentDashboardStats(agentId: string): Promise<AgentDashboardStats> {
  const supabase = await createServerSupabaseClient();

  // Assigned properties
  const { count: assignedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId);

  // Total leads
  const { count: totalLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId);

  // New leads (status = 'nuevo')
  const { count: newLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .eq('status', 'nuevo');

  // Converted leads
  const { count: convertedLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .eq('status', 'convertido');

  // Average rating (from agent table)
  const { data: agent } = await supabase
    .from('agents')
    .select('rating')
    .eq('id', agentId)
    .single();

  return {
    assignedProperties: assignedProperties || 0,
    totalLeads: totalLeads || 0,
    newLeads: newLeads || 0,
    convertedLeads: convertedLeads || 0,
    averageRating: agent?.rating || 0,
  };
}

/**
 * Get user dashboard stats
 */
export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  const supabase = await createServerSupabaseClient();

  // Published properties
  const { count: publishedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', userId)
    .eq('submission_status', 'approved');

  // Pending properties
  const { count: pendingProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', userId)
    .eq('submission_status', 'pending');

  // Rejected properties
  const { count: rejectedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', userId)
    .eq('submission_status', 'rejected');

  // Total views (sum of views_count from user's properties)
  const { data: properties } = await supabase
    .from('properties')
    .select('views_count')
    .eq('submitted_by', userId);

  const totalViews =
    properties?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;

  return {
    publishedProperties: publishedProperties || 0,
    pendingProperties: pendingProperties || 0,
    rejectedProperties: rejectedProperties || 0,
    totalViews,
  };
}

// =====================================================
// SITE SETTINGS
// =====================================================

/**
 * Get all site settings
 */
export async function getSiteSettings() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from('site_settings').select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  // Convert array to object
  return (data || []).reduce(
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>
  );
}

/**
 * Update site setting
 */
export async function updateSiteSetting(key: string, value: unknown) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' })
    .select()
    .single();

  return { data, error };
}

/**
 * Update multiple site settings
 */
export async function updateSiteSettings(settings: Record<string, unknown>) {
  const supabase = createAdminClient();

  const updates = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
  }));

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(updates, { onConflict: 'key' })
    .select();

  return { data, error };
}
