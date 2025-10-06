-- =========================================
-- Migration: Add email column to profiles and sync on user creation
-- =========================================

begin;

-- 1. Add column email to profiles if not exists
alter table public.profiles
add column if not exists email text;

-- 2. Replace function to insert profile with id + email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, null, null);
  return new;
end;
$$ language plpgsql security definer;

-- 3. Drop old trigger if exists and create new one for INSERT
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

commit;

-- =========================================
-- End of migration
-- =========================================
