-- Limpieza de policies previas (ajusta nombres si alguno difiere)
drop policy if exists boards_delete           on public.boards;
drop policy if exists boards_delete_own       on public.boards;
drop policy if exists boards_insert           on public.boards;
drop policy if exists boards_read_own         on public.boards;
drop policy if exists boards_select           on public.boards;
drop policy if exists boards_update           on public.boards;
drop policy if exists boards_update_own       on public.boards;

-- 1) INSERT: cualquier usuario autenticado puede crear (asumiendo trigger que setea created_by := auth.uid())
create policy boards_insert
on public.boards
for insert
to authenticated
with check (auth.uid() is not null);

-- 2) SELECT (OWNER): el creador ve su board SIN tocar board_members (esto rompe el ciclo)
create policy boards_owner_select
on public.boards
for select
to authenticated
using (created_by = auth.uid());

-- 3) (Opcional pero típico) SELECT (MIEMBRO): permitir ver boards a sus miembros
--    Esto sí consulta board_members, pero no hay ciclo si board_members tiene una policy
--    de SELECT basada en user_id (ver nota abajo).
create policy boards_member_select
on public.boards
for select
to authenticated
using (
  exists (
    select 1
    from public.board_members bm
    where bm.board_id = boards.id
      and bm.user_id  = auth.uid()
  )
);

-- 4) UPDATE: solo el owner
create policy boards_update_owner
on public.boards
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

-- 5) DELETE: solo el owner
create policy boards_delete_owner
on public.boards
for delete
to authenticated
using (created_by = auth.uid());