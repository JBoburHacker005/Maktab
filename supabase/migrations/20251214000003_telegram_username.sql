-- Add telegram_username column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS telegram_username TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_telegram_username 
ON public.user_roles(telegram_username);

-- Function to check if telegram username is admin
CREATE OR REPLACE FUNCTION public.is_telegram_username_admin(_telegram_username TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE LOWER(telegram_username) = LOWER(_telegram_username)
      AND (role = 'admin' OR role = 'super_admin')
  )
$$;

