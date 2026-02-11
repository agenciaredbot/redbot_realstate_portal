-- =====================================================
-- MIGRATION: Admin Panel - Authentication & Roles
-- =====================================================
-- This migration adds:
-- 1. Profiles table (extends auth.users with role management)
-- 2. Notifications table (real-time alerts)
-- 3. Modifications to properties for user submissions
-- 4. RLS policies for role-based access control
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Extends auth.users with additional profile data and roles
-- Roles: 1 = Admin, 2 = Agente, 3 = Usuario

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role INTEGER NOT NULL DEFAULT 3 CHECK (role IN (1, 2, 3)),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_agent_id ON profiles(agent_id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 2. NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'new_lead',
    'property_submitted',
    'property_approved',
    'property_rejected',
    'property_assigned',
    'agent_assigned',
    'system'
  )),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- 3. MODIFY PROPERTIES TABLE
-- =====================================================
-- Add columns for user property submissions

DO $$
BEGIN
  -- Add submitted_by column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'submitted_by'
  ) THEN
    ALTER TABLE properties ADD COLUMN submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add submission_status column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'submission_status'
  ) THEN
    ALTER TABLE properties ADD COLUMN submission_status TEXT DEFAULT 'approved'
      CHECK (submission_status IN ('pending', 'approved', 'rejected'));
  END IF;

  -- Add rejection_reason column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'rejection_reason'
  ) THEN
    ALTER TABLE properties ADD COLUMN rejection_reason TEXT;
  END IF;
END $$;

-- Index for pending properties
CREATE INDEX IF NOT EXISTS idx_properties_submission_status ON properties(submission_status);
CREATE INDEX IF NOT EXISTS idx_properties_submitted_by ON properties(submitted_by);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ----- PROFILES POLICIES -----

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- ----- NOTIFICATIONS POLICIES -----

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert notifications (via service role)
CREATE POLICY "Service role can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ----- UPDATED PROPERTIES POLICIES -----

-- Drop existing policies to recreate with role awareness
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Public can view active properties" ON properties;

-- Public can view approved and active properties
CREATE POLICY "Public can view approved active properties"
  ON properties FOR SELECT
  USING (is_active = true AND submission_status = 'approved');

-- Users can view their own submitted properties (any status)
CREATE POLICY "Users can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = submitted_by);

-- Agents can view properties assigned to them
CREATE POLICY "Agents can view assigned properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN agents a ON p.agent_id = a.id
      WHERE p.id = auth.uid() AND properties.agent_id = a.id
    )
  );

-- Admins can view all properties
CREATE POLICY "Admins can view all properties"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- Users can insert properties (will be pending)
CREATE POLICY "Users can submit properties"
  ON properties FOR INSERT
  WITH CHECK (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
  );

-- Users can update their own pending properties
CREATE POLICY "Users can update own pending properties"
  ON properties FOR UPDATE
  USING (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
  )
  WITH CHECK (
    auth.uid() = submitted_by
    AND submission_status = 'pending'
  );

-- Admins can update any property
CREATE POLICY "Admins can update any property"
  ON properties FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- Admins can delete any property
CREATE POLICY "Admins can delete any property"
  ON properties FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- ----- CONTACT SUBMISSIONS POLICIES -----

-- Keep public insert, but add role-based viewing
DROP POLICY IF EXISTS "Admins can view all submissions" ON contact_submissions;

-- Admins can view all contact submissions
CREATE POLICY "Admins can view all contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 1
    )
  );

-- Agents can view submissions assigned to them or for their properties
CREATE POLICY "Agents can view assigned submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN agents a ON p.agent_id = a.id
      WHERE p.id = auth.uid()
        AND (contact_submissions.agent_id = a.id OR contact_submissions.agent_id IS NULL)
    )
  );

-- =====================================================
-- 5. HELPER FUNCTIONS
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS INTEGER AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 1
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify admins
CREATE OR REPLACE FUNCTION notify_admins(
  p_type TEXT,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_data JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT id, p_type, p_title, p_message, p_data
  FROM profiles
  WHERE role = 1 AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. TRIGGERS FOR AUTOMATIC NOTIFICATIONS
-- =====================================================

-- Notify admins when a new property is submitted
CREATE OR REPLACE FUNCTION notify_property_submitted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.submission_status = 'pending' AND NEW.submitted_by IS NOT NULL THEN
    PERFORM notify_admins(
      'property_submitted',
      'Nueva propiedad pendiente de aprobación',
      'Un usuario ha enviado una nueva propiedad para revisión: ' || NEW.title,
      jsonb_build_object('property_id', NEW.id, 'property_title', NEW.title)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_property_submitted
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_submitted();

-- Notify user when property status changes
CREATE OR REPLACE FUNCTION notify_property_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.submission_status != NEW.submission_status AND NEW.submitted_by IS NOT NULL THEN
    IF NEW.submission_status = 'approved' THEN
      PERFORM create_notification(
        NEW.submitted_by,
        'property_approved',
        '¡Tu propiedad ha sido aprobada!',
        'Tu propiedad "' || NEW.title || '" ya está publicada en el portal.',
        jsonb_build_object('property_id', NEW.id)
      );
    ELSIF NEW.submission_status = 'rejected' THEN
      PERFORM create_notification(
        NEW.submitted_by,
        'property_rejected',
        'Tu propiedad no fue aprobada',
        'Tu propiedad "' || NEW.title || '" no cumple con los requisitos. Razón: ' || COALESCE(NEW.rejection_reason, 'No especificada'),
        jsonb_build_object('property_id', NEW.id, 'reason', NEW.rejection_reason)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_property_status_change
  AFTER UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_property_status_change();

-- Notify on new contact submission
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  agent_profile_id UUID;
BEGIN
  -- Notify all admins
  PERFORM notify_admins(
    'new_lead',
    'Nuevo lead recibido',
    'Nuevo contacto de ' || NEW.first_name || ' ' || NEW.last_name,
    jsonb_build_object('submission_id', NEW.id, 'email', NEW.email)
  );

  -- If assigned to an agent, notify them too
  IF NEW.agent_id IS NOT NULL THEN
    SELECT p.id INTO agent_profile_id
    FROM profiles p
    WHERE p.agent_id = NEW.agent_id;

    IF agent_profile_id IS NOT NULL THEN
      PERFORM create_notification(
        agent_profile_id,
        'new_lead',
        'Nuevo lead asignado',
        'Tienes un nuevo lead de ' || NEW.first_name || ' ' || NEW.last_name,
        jsonb_build_object('submission_id', NEW.id)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_lead
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- =====================================================
-- 7. STORAGE BUCKETS
-- =====================================================

-- Create storage buckets for images (run via Supabase dashboard or CLI)
-- These are just reminders - actual bucket creation needs dashboard/CLI

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('property-images', 'property-images', true);

-- =====================================================
-- 8. SEED INITIAL ADMIN USER (Optional)
-- =====================================================
-- This should be done manually or via a seed script after running migration
-- Example: After creating user via Supabase Auth, update their role:
-- UPDATE profiles SET role = 1 WHERE email = 'admin@redbot-realestate.com';

COMMENT ON TABLE profiles IS 'User profiles with role management. Roles: 1=Admin, 2=Agente, 3=Usuario';
COMMENT ON TABLE notifications IS 'Real-time notifications for users';
COMMENT ON COLUMN properties.submission_status IS 'Status of user-submitted properties: pending, approved, rejected';
