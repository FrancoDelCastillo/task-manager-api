-- Asegura RLS activo
alter table public.board_members enable row level security;
alter table public.boards        enable row level security;

------------------------------
-- (A) BOARDS: policies base
------------------------------
-- Limpia las de boards si no las tienes consistentes (opcionales: quita las que choquen)
drop policy if exists boards_select on public.boards;
drop policy if exists boards_insert on public.boards;
drop policy if exists boards_update on public.boards;
drop policy if exists boards_delete on public.boards;

-- SELECT: puedes ver un board si eres el dueño o miembro del board
create policy boards_select
on public.boards
for select
using (
  boards.created_by = auth.uid()
  or exists (
    select 1
    from public.board_members bm
    where bm.board_id = boards.id
      and bm.user_id  = auth.uid()
  )
);

-- INSERT: cualquiera autenticado crea boards propios
create policy boards_insert
on public.boards
for insert
with check ( created_by = auth.uid() );

-- UPDATE/DELETE: solo el dueño del board
create policy boards_update
on public.boards
for update
using ( created_by = auth.uid() )
with check ( created_by = auth.uid() );

create policy boards_delete
on public.boards
for delete
using ( created_by = auth.uid() );

--------------------------------------
-- (B) BOARD_MEMBERS: policies seguras
--------------------------------------
-- SELECT: si puedo “ver” el board (por la policy de boards), puedo ver a TODOS sus miembros
-- (OJO: aquí NO referenciamos board_members ni funciones que lo toquen)
create policy board_members_select
on public.board_members
for select
using (
  exists (
    select 1
    from public.boards b
    where b.id = board_members.board_id
    -- La policy de SELECT de 'boards' ya restringe que solo dueño/miembro "vea" ese board.
  )
);

-- INSERT/UPDATE/DELETE: solo el dueño del board (admin simple = owner)
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