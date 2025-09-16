import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../lib/env"

const url = getEnv("SUPABASE_URL");
const anonKey = getEnv("SUPABASE_ANON_KEY");

// Main client for user operations (with RLS)
export const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
})

export const createSupabaseClient = (accessToken?: string) => {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: accessToken ? `Bearer ${accessToken}` : "",
                },
            },
        }
    );
};