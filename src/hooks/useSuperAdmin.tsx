
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useSuperAdmin = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user logged in");
          setIsSuperAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // Get user email from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsSuperAdmin(false);
          setIsLoading(false);
          return;
        }
        
        const userEmail = profileData?.email;
        console.log("User email:", userEmail);
        
        // Only stodmarketing@gmail.com can be superadmin
        if (userEmail === 'stodmarketing@gmail.com') {
          console.log("User is stodmarketing@gmail.com - granting superadmin access");
          setIsSuperAdmin(true);
        } else {
          console.log("User is not stodmarketing@gmail.com - denying superadmin access");
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error("Unexpected error checking superadmin status:", error);
        setIsSuperAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSuperAdmin();
  }, []);

  return { isSuperAdmin, isLoading };
};
