-- ================================
-- PROFILES (extends auth.users)
-- ================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policies
create policy "profiles_read_own"
on public.profiles for select
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);


-- ================================
-- BOARDS
-- ================================
create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id) on delete cascade
);

alter table public.boards enable row level security;

-- Policies
create policy "boards_insert"
on public.boards for insert
with check ((select auth.uid()) = created_by);

create policy "boards_read_own"
on public.boards for select
using ((select auth.uid()) = created_by);

create policy "boards_update_own"
on public.boards for update
using ((select auth.uid()) = created_by);

create policy "boards_delete_own"
on public.boards for delete
using ((select auth.uid()) = created_by);


-- ================================
-- BOARD MEMBERS
-- ================================
create table if not exists public.board_members (
  board_id uuid references public.boards(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text not null check (role in ('admin','member','viewer')),
  primary key (board_id, user_id)
);

alter table public.board_members enable row level security;

-- Policies
create policy "board_members_read"
on public.board_members for select
using (
  (select auth.uid()) = user_id
  or exists (
    select 1 from public.board_members bm
    where bm.board_id = board_members.board_id
    and bm.user_id = (select auth.uid())
    and bm.role = 'admin'
  )
);

create policy "board_members_insert_admins"
on public.board_members for insert
with check (
  exists (
    select 1 from public.board_members bm
    where bm.board_id = board_members.board_id
    and bm.user_id = (select auth.uid())
    and bm.role = 'admin'
  )
);

create policy "board_members_update_admins"
on public.board_members for update
using (
  exists (
    select 1 from public.board_members bm
    where bm.board_id = board_members.board_id
    and bm.user_id = (select auth.uid())
    and bm.role = 'admin'
  )
);

create policy "board_members_delete_admins"
on public.board_members for delete
using (
  exists (
    select 1 from public.board_members bm
    where bm.board_id = board_members.board_id
    and bm.user_id = (select auth.uid())
    and bm.role = 'admin'
  )
);


-- ================================
-- TASKS
-- ================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'todo',
  created_at timestamptz not null default now(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  edited_at timestamptz,
  edited_by uuid references public.profiles(id) on delete set null
);

alter table public.tasks enable row level security;

-- Policies
create policy "tasks_read_members"
on public.tasks for select
using (
  exists (
    select 1 from public.board_members
    where board_members.board_id = tasks.board_id
    and board_members.user_id = (select auth.uid())
  )
);

create policy "tasks_insert_members"
on public.tasks for insert
with check (
  exists (
    select 1 from public.board_members
    where board_members.board_id = tasks.board_id
    and board_members.user_id = (select auth.uid())
    and board_members.role in ('admin','member')
  )
);

create policy "tasks_update_admins_or_own"
on public.tasks for update
using (
  exists (
    select 1 from public.board_members
    where board_members.board_id = tasks.board_id
    and board_members.user_id = (select auth.uid())
    and (
      board_members.role = 'admin'
      or tasks.created_by = (select auth.uid())
    )
  )
)
with check (true);

create policy "tasks_delete_admins"
on public.tasks for delete
using (
  exists (
    select 1 from public.board_members
    where board_members.board_id = tasks.board_id
    and board_members.user_id = (select auth.uid())
    and board_members.role = 'admin'
  )
);


-- ================================
-- FUNCTIONS & TRIGGERS (hardened)
-- ================================

-- Auto-set board creator
create or replace function set_board_creator()
returns trigger as $$
begin
  new.created_by := auth.uid();
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create trigger trg_set_board_creator
before insert on public.boards
for each row
execute function set_board_creator();

-- Audit task updates
create or replace function update_task_audit()
returns trigger as $$
begin
  new.edited_at = now();
  new.edited_by = auth.uid();
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create trigger set_task_audit
before update on public.tasks
for each row
execute function update_task_audit();

-- Auto-add board creator as admin
create or replace function add_board_creator_as_admin()
returns trigger as $$
begin
  insert into public.board_members (board_id, user_id, role)
  values (new.id, new.created_by, 'admin')
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create trigger set_board_creator_as_admin
after insert on public.boards
for each row
execute function add_board_creator_as_admin();


-- ================================
-- INDEXES
-- ================================
create index if not exists idx_boards_created_by on public.boards(created_by);
create index if not exists idx_board_members_board_id on public.board_members(board_id);
create index if not exists idx_board_members_user_id on public.board_members(user_id);
create index if not exists idx_tasks_board_id on public.tasks(board_id);
create index if not exists idx_tasks_created_by on public.tasks(created_by);
create index if not exists idx_tasks_edited_by on public.tasks(edited_by);