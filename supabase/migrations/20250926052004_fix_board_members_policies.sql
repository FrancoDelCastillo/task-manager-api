drop policy if exists board_members_select on public.board_members;
drop policy if exists board_members_insert on public.board_members;
drop policy if exists board_members_update on public.board_members;
drop policy if exists board_members_delete on public.board_members;

-- 2) Borrar funciones helper usadas dentro de policies de board_members
--    (causan recursión si vuelven a tocar board_members desde su propia policy)
drop function if exists public.is_board_member(uuid);
drop function if exists public.is_board_admin(uuid);