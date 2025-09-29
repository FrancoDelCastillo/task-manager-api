grant usage on schema public to authenticated;

-- Asegurar que tengan acceso a la tabla profiles según RLS
grant select, update on table public.profiles to authenticated;

-- (opcional) si quieres que puedan crear su fila en el signup
-- grant insert on table public.profiles to authenticated;

-- Asegurar que usuarios anónimos no vean nada
revoke all on table public.profiles from anon;
revoke usage on schema public from anon;