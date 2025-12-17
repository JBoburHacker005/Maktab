-- Admin user setup
-- This migration assigns admin role to the user with email jbobur005@gmail.com
-- 
-- IMPORTANT: You must first create the user in Supabase Dashboard:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Enter:
--    - Email: jbobur005@gmail.com
--    - Password: boburbek005
--    - Auto Confirm User: Yes (checked)
-- 4. Click "Create user"
-- 5. Then run this migration to assign admin role

-- Assign admin role to the user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'jbobur005@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

