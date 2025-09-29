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
    
    const url = getEnv("SUPABASE_URL");
    const serviceKey  = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = getEnv("SUPABASE_ANON_KEY");
    
    // Validate the token with service role key
    const serviceClient = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: { user }, error } = await serviceClient.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    // Create an RLS-enabled client using anon key + user JWT
    const rlsClient = createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    
    // Attach both user info and RLS-enabled client to the request
    req.user = {
      id: user.id,
      email: user.email
    };

    req.userId = user.id;
    req.accessToken = token; 
    req.supabase = rlsClient;
    req.supabaseAuth = rlsClient;

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};