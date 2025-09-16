drop policy if exists "boards_insert" on public.boards;

create policy "boards_insert"
on public.boards for insert
with check (auth.uid() is not null);