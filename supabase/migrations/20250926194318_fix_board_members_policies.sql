-- Asegura RLS
alter table public.board_members enable row level security;

-- 0) Limpia cualquier policy previa para evitar solapes
drop policy if exists board_members_select on public.board_members;
drop policy if exists board_members_select_self on public.board_members;
drop policy if exists board_members_insert on public.board_members;
drop policy if exists board_members_update on public.board_members;
drop policy if exists board_members_delete on public.board_members;
drop policy if exists board_members_insert_admin_bootstrap on public.board_members;

-- 1) Función helper (está bien usarla). Mantén SECURITY DEFINER + search_path
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

-- 2) SELECT en board_members SIN tocar boards
--    Regla: un usuario solo ve sus propias filas de membresía.
--    (Esto permite que la policy boards_member_select en `boards` haga EXISTS(...)
--     sin generar ciclos.)
create policy board_members_select_self
on public.board_members
for select
to authenticated
using (user_id = auth.uid());

-- 3) INSERT: solo el owner del board puede agregar miembros
create policy board_members_insert
on public.board_members
for insert
to authenticated
with check ( public.is_board_owner(board_members.board_id) );

-- 4) UPDATE: solo el owner del board puede modificar miembros
create policy board_members_update
on public.board_members
for update
to authenticated
using      ( public.is_board_owner(board_members.board_id) )
with check ( public.is_board_owner(board_members.board_id) );

-- 5) DELETE: solo el owner del board puede eliminar miembros
create policy board_members_delete
on public.board_members
for delete
to authenticated
using ( public.is_board_owner(board_members.board_id) );

-- 6) (Opcional, pero útil) Bootstrap para la primera fila del creador como admin
--    Evita cualquier dependencia al crear el board + trigger que inserta su membresía.
create policy board_members_insert_admin_bootstrap
on public.board_members
for insert
to authenticated
with check (
  role = 'admin'
  and user_id = auth.uid()
);