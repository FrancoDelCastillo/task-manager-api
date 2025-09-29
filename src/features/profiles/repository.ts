import { supabase } from "../../db/supabase";
import { supabaseSrv } from "../../db/supabase";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export const getProfileById = async (
  profileId: string
): Promise<Profile | null> => {
  try {
    const { data, error } = await supabaseSrv
      .from("profiles")
      .select("id, first_name, last_name, avatar_url, created_at, updated_at")
      .eq("id", profileId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw {
      message: "Failed to fetch profile",
      statusCode: 500,
      code: "FETCH_PROFILE_ERROR"
    };
  }
};

export const updateProfile = async (
  profileId: string, 
  updates: UpdateProfileInput
): Promise<Profile> => {
  try {
    const { data, error } = await supabaseSrv
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", profileId)
      .select("id, first_name, last_name, avatar_url, created_at, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw {
      message: "Failed to update profile",
      statusCode: 500,
      code: "UPDATE_PROFILE_ERROR"
    };
  }
};

export const uploadAvatar = async (
  userId: string,
  file: Buffer,
  contentType: string
): Promise<string> => {
  try {
    const filePath = `${userId}/avatar/avatar.png`;
    
    const { data, error } = await supabaseSrv.storage
      .from("avatars")
      .upload(filePath, file, { 
        upsert: true,
        contentType 
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseSrv.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    throw {
      message: "Failed to upload avatar",
      statusCode: 500,
      code: "UPLOAD_AVATAR_ERROR"
    };
  }
};
