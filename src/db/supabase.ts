import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../lib/env"

const url = getEnv("SUPABASE_URL");
const anonKey = getEnv("SUPABASE_ANON_KEY");

// Anon client with RLS
export const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
})

// Client with Service Role
export const supabaseSrv = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
);