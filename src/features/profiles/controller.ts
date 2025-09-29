import { Response } from "express";
import { AuthenticatedRequest } from "../../types/auth";
import * as profileRepo from "./repository";

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profileId } = req.params;
    const userId = req.userId!;

    if (!profileId) {
      return res.status(400).json({ 
        error: "Missing profile id in params",
        code: "MISSING_PARAMS"
      });
    }

    // Users can only view their own profile
    if (profileId !== userId) {
      return res.status(403).json({ 
        error: "Access denied",
        code: "ACCESS_DENIED"
      });
    }

    console.log("get profile repo")
    const profile = await profileRepo.getProfileById(profileId);
    
    if (!profile) {
      return res.status(404).json({ 
        error: "Profile not found",
        code: "PROFILE_NOT_FOUND"
      });
    }

    res.json(profile);
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({ 
      error: err.message,
      code: errorCode
    });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profileId } = req.params;
    const userId = req.userId!;
    const { first_name, last_name, avatar_url } = req.body;

    if (!profileId) {
      return res.status(400).json({ 
        error: "Missing profile id in params",
        code: "MISSING_PARAMS"
      });
    }

    // Users can only update their own profile
    if (profileId !== userId) {
      return res.status(403).json({ 
        error: "Access denied",
        code: "ACCESS_DENIED"
      });
    }

    // Validate input
    if (first_name && typeof first_name !== 'string') {
      return res.status(400).json({ 
        error: "first_name must be a string",
        code: "INVALID_INPUT"
      });
    }

    if (last_name && typeof last_name !== 'string') {
      return res.status(400).json({ 
        error: "last_name must be a string",
        code: "INVALID_INPUT"
      });
    }

    if (avatar_url && typeof avatar_url !== 'string') {
      return res.status(400).json({ 
        error: "avatar_url must be a string",
        code: "INVALID_INPUT"
      });
    }

    const updates = {
      ...(first_name !== undefined && { first_name }),
      ...(last_name !== undefined && { last_name }),
      ...(avatar_url !== undefined && { avatar_url }),
    };

    const updatedProfile = await profileRepo.updateProfile(profileId, updates);
    
    res.json(updatedProfile);
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';
    
    res.status(statusCode).json({ 
      error: err.message,
      code: errorCode
    });
  }
};
