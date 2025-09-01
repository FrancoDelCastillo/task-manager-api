-- Fix boards_insert policy to properly establish user context for RLS
-- This migration updates the policy to check both authentication and user ownership

-- Drop the existing policy
drop policy if exists "boards_insert" on public.boards;

-- Create the corrected policy that establishes proper RLS context
create policy "boards_insert"
on public.boards for insert
with check (
  auth.uid() IS NOT NULL 
  AND auth.uid() = created_by
);

-- Verify the policy was created correctly
select 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual, 
  with_check
from pg_policies 
where tablename = 'boards' and policyname = 'boards_insert';