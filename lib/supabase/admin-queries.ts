import { createServerSupabaseClient, createAdminClient } from './server';
import { getCurrentTenantId } from './tenant-queries';
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
// PROFILE QUERIES (Multi-tenant)
// =====================================================

/**
 * Get all profiles for the current tenant (admin only)
 */
export async function getAllProfiles(
  options: {
    role?: UserRole;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {},
  tenantId?: string
) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  let query = supabase
    .from('profiles')
    .select(
      `
      *,
      agent:agents(id, first_name, last_name, photo_url)
    `,
      { count: 'exact' }
    )
    .eq('tenant_id', currentTenantId)
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
 * Get profile by ID (validates tenant access)
 */
export async function getProfileById(id: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      agent:agents(*)
    `
    )
    .eq('id', id)
    .eq('tenant_id', currentTenantId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Update profile role (validates tenant access)
 */
export async function updateProfileRole(id: string, role: UserRole, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Deactivate/Activate profile (validates tenant access)
 */
export async function toggleProfileActive(id: string, isActive: boolean, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Link profile to agent (validates tenant access)
 */
export async function linkProfileToAgent(profileId: string, agentId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({ agent_id: agentId, role: 2 }) // Role 2 = Agent
    .eq('id', profileId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// NOTIFICATION QUERIES (Multi-tenant)
// =====================================================

/**
 * Get notifications for current user (within tenant)
 */
export async function getNotifications(userId: string, limit = 20, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('tenant_id', currentTenantId)
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
export async function getUnreadNotificationCount(userId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('tenant_id', currentTenantId)
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
export async function markNotificationAsRead(notificationId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('tenant_id', currentTenantId);

  return { error };
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('tenant_id', currentTenantId)
    .eq('is_read', false);

  return { error };
}

// =====================================================
// PROPERTY QUERIES (Admin - Multi-tenant)
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
  } = {},
  tenantId?: string
) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  let query = supabase
    .from('properties')
    .select(
      `
      id, reference_code, title, slug, status, property_type, price, city,
      is_active, is_featured, submitted_by, submission_status,
      rejection_reason, agent_id, created_at, updated_at,
      submitter:profiles!submitted_by(id, full_name, email, avatar_url),
      agent:agents!agent_id(id, first_name, last_name, photo_url)
    `,
      { count: 'exact' }
    )
    .eq('tenant_id', currentTenantId)
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
 * Get pending properties count for tenant
 */
export async function getPendingPropertiesCount(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('submission_status', 'pending');

  if (error) {
    console.error('Error fetching pending count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Approve property (validates tenant access)
 */
export async function approveProperty(propertyId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({
      submission_status: 'approved',
      is_active: true,
      rejection_reason: null,
    })
    .eq('id', propertyId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Reject property (validates tenant access)
 */
export async function rejectProperty(propertyId: string, reason: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({
      submission_status: 'rejected',
      is_active: false,
      rejection_reason: reason,
    })
    .eq('id', propertyId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Assign property to agent (validates tenant access)
 */
export async function assignPropertyToAgent(propertyId: string, agentId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ agent_id: agentId })
    .eq('id', propertyId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  // TODO: Create notification for the agent

  return { data, error };
}

/**
 * Toggle property featured status (validates tenant access)
 */
export async function togglePropertyFeatured(propertyId: string, isFeatured: boolean, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ is_featured: isFeatured })
    .eq('id', propertyId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Toggle property active status (validates tenant access)
 */
export async function togglePropertyActive(propertyId: string, isActive: boolean, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ is_active: isActive })
    .eq('id', propertyId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// CONTACT SUBMISSIONS QUERIES (Multi-tenant)
// =====================================================

/**
 * Get all contact submissions for tenant (admin)
 */
export async function getContactSubmissions(
  options: {
    status?: string;
    agentId?: string;
    limit?: number;
    offset?: number;
  } = {},
  tenantId?: string
) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

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
    .eq('tenant_id', currentTenantId)
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
 * Update contact submission status (validates tenant access)
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
  notes?: string,
  tenantId?: string
) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const updates: Record<string, unknown> = { status };
  if (notes) updates.notes = notes;

  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', submissionId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

/**
 * Assign submission to agent (validates tenant access)
 */
export async function assignSubmissionToAgent(submissionId: string, agentId: string, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ agent_id: agentId })
    .eq('id', submissionId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// DASHBOARD STATS (Multi-tenant)
// =====================================================

/**
 * Get admin dashboard stats for tenant
 */
export async function getAdminDashboardStats(tenantId?: string): Promise<AdminDashboardStats> {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  // Total properties
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId);

  // Active properties
  const { count: activeProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true)
    .eq('submission_status', 'approved');

  // Pending properties
  const { count: pendingProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('submission_status', 'pending');

  // Total agents
  const { count: totalAgents } = await supabase
    .from('agents')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('is_active', true);

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId);

  // Leads this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: leadsThisMonth } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
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
    .eq('tenant_id', currentTenantId)
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
 * Get agent dashboard stats (within tenant)
 */
export async function getAgentDashboardStats(agentId: string, tenantId?: string): Promise<AgentDashboardStats> {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  // Assigned properties
  const { count: assignedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('agent_id', agentId);

  // Total leads
  const { count: totalLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('agent_id', agentId);

  // New leads (status = 'nuevo')
  const { count: newLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('agent_id', agentId)
    .eq('status', 'nuevo');

  // Converted leads
  const { count: convertedLeads } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('agent_id', agentId)
    .eq('status', 'convertido');

  // Average rating (from agent table)
  const { data: agent } = await supabase
    .from('agents')
    .select('rating')
    .eq('id', agentId)
    .eq('tenant_id', currentTenantId)
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
 * Get user dashboard stats (within tenant)
 */
export async function getUserDashboardStats(userId: string, tenantId?: string): Promise<UserDashboardStats> {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  // Published properties
  const { count: publishedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('submitted_by', userId)
    .eq('submission_status', 'approved');

  // Pending properties
  const { count: pendingProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('submitted_by', userId)
    .eq('submission_status', 'pending');

  // Rejected properties
  const { count: rejectedProperties } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', currentTenantId)
    .eq('submitted_by', userId)
    .eq('submission_status', 'rejected');

  // Total views (sum of views_count from user's properties)
  const { data: properties } = await supabase
    .from('properties')
    .select('views_count')
    .eq('tenant_id', currentTenantId)
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
// SITE SETTINGS (Multi-tenant)
// =====================================================

/**
 * Get all site settings for tenant
 */
export async function getSiteSettings(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('tenant_id', currentTenantId);

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
 * Update site setting (validates tenant access)
 */
export async function updateSiteSetting(key: string, value: unknown, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(
      { tenant_id: currentTenantId, key, value },
      { onConflict: 'tenant_id,key' }
    )
    .select()
    .single();

  return { data, error };
}

/**
 * Update multiple site settings (validates tenant access)
 */
export async function updateSiteSettings(settings: Record<string, unknown>, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const updates = Object.entries(settings).map(([key, value]) => ({
    tenant_id: currentTenantId,
    key,
    value,
  }));

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(updates, { onConflict: 'tenant_id,key' })
    .select();

  return { data, error };
}

// =====================================================
// AGENTS QUERIES (Admin - Multi-tenant)
// =====================================================

/**
 * Get all agents for tenant (admin)
 */
export async function getAdminAgents(tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('tenant_id', currentTenantId)
    .order('first_name', { ascending: true });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

/**
 * Toggle agent active status (validates tenant access)
 */
export async function toggleAgentActive(agentId: string, isActive: boolean, tenantId?: string) {
  const currentTenantId = tenantId || await getCurrentTenantId();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agents')
    .update({ is_active: isActive })
    .eq('id', agentId)
    .eq('tenant_id', currentTenantId)
    .select()
    .single();

  return { data, error };
}
