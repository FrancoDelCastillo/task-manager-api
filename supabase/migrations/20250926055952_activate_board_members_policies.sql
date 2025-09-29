-- Asegura que RLS esté habilitado en board_members
alter table public.board_members enable row level security;

-- SELECT: si puedes ver el board (según las policies de boards),
-- entonces puedes ver a TODOS los miembros de ese board
create policy board_members_select
on public.board_members
for select
using (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
  )
);

-- INSERT: solo el dueño del board puede añadir miembros
create policy board_members_insert
on public.board_members
for insert
with check (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
      and b.created_by = auth.uid()
  )
);

-- UPDATE: solo el dueño del board puede cambiar roles, etc.
create policy board_members_update
on public.board_members
for update
using (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
      and b.created_by = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
      and b.created_by = auth.uid()
  )
);

-- DELETE: solo el dueño del board puede remover miembros
create policy board_members_delete
on public.board_members
for delete
using (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
      and b.created_by = auth.uid()
  )
);