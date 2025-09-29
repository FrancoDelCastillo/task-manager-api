import type { Request } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };

  userId?: string;

  accessToken?: string;

  // RLS (anon + Authorization: Bearer <token>)
  supabase?: SupabaseClient;

  // Alias legacy
  supabaseAuth?: SupabaseClient;
}

export interface AuthUser {
  id: string;
  email?: string;
}