// =====================================================
// ADMIN PANEL TYPES
// =====================================================

// User Roles
// 0 = Super Admin (manages all tenants)
// 1 = Admin (manages their tenant)
// 2 = Agent (real estate agent)
// 3 = User (regular user)
export const USER_ROLES = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  AGENT: 2,
  USER: 3,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.AGENT]: 'Agente',
  [USER_ROLES.USER]: 'Usuario',
};

// Profile (extends auth.users)
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  agent_id: string | null;
  tenant_id: string;  // Multi-tenant support
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Profile with agent details (for agent users)
export interface ProfileWithAgent extends Profile {
  agent?: {
    id: string;
    slug: string;
    first_name: string;
    last_name: string;
    photo_url: string | null;
  };
}

// Notification Types
export const NOTIFICATION_TYPES = {
  NEW_LEAD: 'new_lead',
  PROPERTY_SUBMITTED: 'property_submitted',
  PROPERTY_APPROVED: 'property_approved',
  PROPERTY_REJECTED: 'property_rejected',
  PROPERTY_ASSIGNED: 'property_assigned',
  AGENT_ASSIGNED: 'agent_assigned',
  SYSTEM: 'system',
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// Property Submission Status
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  [SUBMISSION_STATUS.PENDING]: 'Pendiente',
  [SUBMISSION_STATUS.APPROVED]: 'Aprobada',
  [SUBMISSION_STATUS.REJECTED]: 'Rechazada',
};

export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  [SUBMISSION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [SUBMISSION_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [SUBMISSION_STATUS.REJECTED]: 'bg-red-100 text-red-800',
};

// Extended Property type with submission fields
export interface PropertyWithSubmission {
  id: string;
  title: string;
  slug: string;
  status: string;
  property_type: string;
  price: number;
  city: string;
  is_active: boolean;
  is_featured: boolean;
  submitted_by: string | null;
  submission_status: SubmissionStatus;
  rejection_reason: string | null;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  submitter?: Profile;
  agent?: {
    id: string;
    first_name: string;
    last_name: string;
    photo_url: string | null;
  };
}

// Dashboard Stats
export interface AdminDashboardStats {
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  totalAgents: number;
  totalUsers: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
  leadsChange: number; // percentage
}

export interface AgentDashboardStats {
  assignedProperties: number;
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  averageRating: number;
}

export interface UserDashboardStats {
  publishedProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  totalViews: number;
}

// Contact Submission with profile
export interface ContactSubmissionWithDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: string;
  message: string;
  property_id: string | null;
  agent_id: string | null;
  ghl_contact_id: string | null;
  status: string;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  // Joined data
  property?: {
    id: string;
    title: string;
    slug: string;
  };
  agent?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

// Admin Navigation Items
export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[]; // Which roles can see this item
  badge?: number; // Optional notification badge
}

// Form types for creating/editing
export interface CreatePropertyForm {
  title: string;
  description: string;
  property_type: string;
  status: 'venta' | 'arriendo';
  price: number;
  city: string;
  neighborhood: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  amenities: string[];
  images: File[];
}

export interface UpdateProfileForm {
  full_name: string;
  phone: string;
  avatar_url?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Activity Log (for future use)
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
