
import { supabase } from "./supabase";

// Simplified function to check if a bucket exists
const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data } = await supabase.storage.getBucket(bucketName);
    return !!data;
  } catch (error) {
    // If bucket doesn't exist, it will throw an error
    return false;
  }
};

export const testStorageAccess = async (): Promise<boolean> => {
  try {
    // Try to list files in the avatars bucket to verify we have access
    console.log("Testing storage access...");
    const { data, error } = await supabase.storage
      .from('avatars')
      .list();
    
    if (error) {
      console.error("Storage access test failed (list):", error);
      return false;
    }
    
    console.log("Storage access test successful");
    return true;
    
  } catch (error) {
    console.error("Storage access test failed with exception:", error);
    return false;
  }
};

export const getAvatarUrl = (avatarPath: string | null): string => {
  if (!avatarPath) return '';
  
  try {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarPath);
    
    return data.publicUrl;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return '';
  }
};
