-- =====================================================
-- MIGRATION: Add reference_code to properties
-- =====================================================
-- Adds a human-readable reference code for properties
-- Format: RB-0001, RB-0002, etc.
-- =====================================================

-- 1. Add the reference_code column
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS reference_code VARCHAR(20) UNIQUE;

-- 2. Create a sequence for auto-generating codes
CREATE SEQUENCE IF NOT EXISTS property_reference_seq START 1;

-- 3. Create function to generate reference code
CREATE OR REPLACE FUNCTION generate_property_reference_code()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  -- Get next sequence value
  next_num := nextval('property_reference_seq');

  -- Format as RB-0001, RB-0002, etc.
  NEW.reference_code := 'RB-' || LPAD(next_num::TEXT, 4, '0');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-assign reference_code on insert
DROP TRIGGER IF EXISTS set_property_reference_code ON properties;
CREATE TRIGGER set_property_reference_code
  BEFORE INSERT ON properties
  FOR EACH ROW
  WHEN (NEW.reference_code IS NULL)
  EXECUTE FUNCTION generate_property_reference_code();

-- 5. Generate reference codes for existing properties (if any)
DO $$
DECLARE
  prop RECORD;
  next_num INTEGER;
BEGIN
  FOR prop IN
    SELECT id FROM properties
    WHERE reference_code IS NULL
    ORDER BY created_at ASC
  LOOP
    next_num := nextval('property_reference_seq');
    UPDATE properties
    SET reference_code = 'RB-' || LPAD(next_num::TEXT, 4, '0')
    WHERE id = prop.id;
  END LOOP;
END $$;

-- 6. Create index for faster lookups by reference_code
CREATE INDEX IF NOT EXISTS idx_properties_reference_code ON properties(reference_code);

-- 7. Add comment
COMMENT ON COLUMN properties.reference_code IS 'Human-readable reference code (e.g., RB-0001) for client communication';
