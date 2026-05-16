insert into storage.buckets (id, name, public) values ('cms-images', 'cms-images', true);

create policy "Public can view cms-images"
on storage.objects for select
using (bucket_id = 'cms-images');

create policy "Authenticated can upload cms-images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'cms-images');

create policy "Authenticated can update cms-images"
on storage.objects for update
to authenticated
using (bucket_id = 'cms-images');

create policy "Authenticated can delete cms-images"
on storage.objects for delete
to authenticated
using (bucket_id = 'cms-images');