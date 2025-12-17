-- Allow both super_admin and admin to insert roles into user_roles
-- so that regular admins can add Telegram bot admins.

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'super_admin')
);


