-- BOARDS: drop de todas las policies conocidas
drop policy if exists boards_delete_owner  on public.boards;
drop policy if exists boards_insert        on public.boards;
drop policy if exists boards_member_select on public.boards;
drop policy if exists boards_owner_select  on public.boards;
drop policy if exists boards_update_owner  on public.boards;

-- Por si quedaron con otros nombres en migraciones previas
drop policy if exists boards_select   on public.boards;
drop policy if exists boards_read_own on public.boards;
drop policy if exists boards_update   on public.boards;
drop policy if exists boards_delete   on public.boards;

-- BOARD_MEMBERS: drop de todas las policies
drop policy if exists board_members_delete                 on public.board_members;
drop policy if exists board_members_insert                 on public.board_members;
drop policy if exists board_members_insert_admin_bootstrap on public.board_members;
drop policy if exists board_members_select_self            on public.board_members;
drop policy if exists board_members_update                 on public.board_members;

-- Helpers de RLS que ya no usaremos
revoke execute on function public.is_board_owner(uuid) from public, authenticated;
drop function if exists public.is_board_owner(uuid);