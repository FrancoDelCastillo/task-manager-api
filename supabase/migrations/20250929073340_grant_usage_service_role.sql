-- Dar control total al rol service_role en profiles
grant all on table public.profiles to service_role;

-- Dar permisos sobre la secuencia (si usas serial/identity)
grant usage, select, update on all sequences in schema public to service_role;