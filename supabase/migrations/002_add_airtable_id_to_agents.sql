-- =====================================================
-- Migration 002: Add airtable_id to agents table
-- Enables proper Airtable <-> Supabase agent mapping
-- for property sync (Agent_Assigned field)
-- =====================================================

-- Add airtable_id column to agents
ALTER TABLE agents ADD COLUMN IF NOT EXISTS airtable_id VARCHAR(50) UNIQUE;

-- Create index for fast lookups during sync
CREATE INDEX IF NOT EXISTS idx_agents_airtable_id ON agents(airtable_id);
