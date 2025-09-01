import { Request } from "express";
import { SupabaseClient } from "@supabase/supabase-js";

// Extend the Express Request interface to include user property and authenticated supabase client
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
  supabase?: SupabaseClient;
}

// User type for authentication
export interface AuthUser {
  id: string;
  email?: string;
}
