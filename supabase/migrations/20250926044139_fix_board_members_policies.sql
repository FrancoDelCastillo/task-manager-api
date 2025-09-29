create or replace function public.is_board_member(p_board_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.board_members bm
    where bm.board_id = p_board_id
      and bm.user_id  = auth.uid()
  );
$$;

grant execute on function public.is_board_member(uuid) to anon, authenticated;

create policy board_members_select
on public.board_members
for select
using ( public.is_board_member(board_members.board_id) );

create or replace function public.is_board_admin(p_board_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.board_members bm
    where bm.board_id = p_board_id
      and bm.user_id  = auth.uid()
      and bm.role     = 'admin'
  );
$$;

grant execute on function public.is_board_admin(uuid) to anon, authenticated;

create policy board_members_insert on public.board_members
for insert
with check ( public.is_board_admin(board_members.board_id) );

create policy board_members_update on public.board_members
for update
using ( public.is_board_admin(board_members.board_id) )
with check ( public.is_board_admin(board_members.board_id) );

create policy board_members_delete on public.board_members
for delete
using ( public.is_board_admin(board_members.board_id) );