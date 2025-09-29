-- 1. Borrar todas las policies existentes en board_members
drop policy if exists board_members_delete on public.board_members;
drop policy if exists board_members_delete_admins on public.board_members;
drop policy if exists board_members_insert on public.board_members;
drop policy if exists board_members_insert_admins on public.board_members;
drop policy if exists board_members_read on public.board_members;
drop policy if exists board_members_update on public.board_members;
drop policy if exists board_members_update_admins on public.board_members;

-- 2. Desactivar Row Level Security en la tabla
alter table public.board_members disable row level security;