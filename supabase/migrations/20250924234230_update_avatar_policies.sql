create policy "Users can upload their own avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = 'public'
);

create policy "Users can update their own avatars"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars');

create policy "Users can delete their own avatars"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars');