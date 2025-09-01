import { Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../lib/env";
import { AuthenticatedRequest } from "../types/auth";

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Create a Supabase client
    const url = getEnv("SUPABASE_URL");
    const anonKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    
    // Validate the token by getting the user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Create a new client using service role key (bypasses RLS)
    const authenticatedSupabase = createClient(url, anonKey, {
      auth: { 
        persistSession: false, 
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    // Attach both user info and authenticated supabase client to the request
    req.user = {
      id: user.id,
      email: user.email
    };
    
    req.supabase = authenticatedSupabase;
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
