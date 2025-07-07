-- Update gallery table to remove image_url and add image_data
ALTER TABLE gallery DROP COLUMN IF EXISTS image_url;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_data TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_type VARCHAR(50);

-- Update projects table to remove image_url and add image_data
ALTER TABLE projects DROP COLUMN IF EXISTS image_url;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_data TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_type VARCHAR(50);

-- Update existing records to have default values
UPDATE gallery SET image_data = '', image_type = 'image/jpeg' WHERE image_data IS NULL;
UPDATE projects SET image_data = '', image_type = 'image/jpeg' WHERE image_data IS NULL;
