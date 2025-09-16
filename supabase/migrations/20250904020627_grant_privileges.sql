-- Allow authenticated users to use the schema
grant usage on schema public to authenticated;

-- PROFILES
grant select, update on public.profiles to authenticated;

-- BOARDS
grant select, insert, update, delete on public.boards to authenticated;

-- BOARD MEMBERS
grant select, insert, update, delete on public.board_members to authenticated;

-- TASKS
grant select, insert, update, delete on public.tasks to authenticated;