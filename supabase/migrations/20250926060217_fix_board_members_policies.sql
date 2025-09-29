-- Función helper que NO sufre RLS porque es SECURITY DEFINER
create or replace function public.is_board_owner(p_board_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.boards b
    where b.id = p_board_id
      and b.created_by = auth.uid()
  );
$$;

grant execute on function public.is_board_owner(uuid) to authenticated;

-- Ahora las policies de board_members usan la función,
-- en lugar de consultar boards directamente.
drop policy if exists board_members_insert on public.board_members;
create policy board_members_insert
on public.board_members
for insert
with check ( public.is_board_owner(board_members.board_id) );

drop policy if exists board_members_update on public.board_members;
create policy board_members_update
on public.board_members
for update
using ( public.is_board_owner(board_members.board_id) )
with check ( public.is_board_owner(board_members.board_id) );

drop policy if exists board_members_delete on public.board_members;
create policy board_members_delete
on public.board_members
for delete
using ( public.is_board_owner(board_members.board_id) );
