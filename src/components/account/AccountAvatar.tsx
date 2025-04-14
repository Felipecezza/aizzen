import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { testStorageAccess } from "@/lib/storage-setup";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const AccountAvatar = ({ 
  userData, 
  setUserData,
  storageBucketReady
}: {
  userData: any;
  setUserData: (data: any) => void;
  storageBucketReady: boolean;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retryingStorageTest, setRetryingStorageTest] = useState(false);

  const retryStorageTest = async () => {
    setRetryingStorageTest(true);
    setUploadError(null);
    
    try {
      const storageAccessible = await testStorageAccess();
      
      if (storageAccessible) {
        toast.success("Serviço de armazenamento está funcionando!");
        setUploadError(null);
      } else {
        setUploadError("O teste de armazenamento falhou. Verifique se você está autenticado corretamente.");
        toast.error("Falha no teste de acesso ao armazenamento.");
      }
    } catch (error) {
      console.error("Error testing storage:", error);
      setUploadError("Erro ao testar o acesso ao armazenamento.");
    } finally {
      setRetryingStorageTest(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. O tamanho máximo é 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Usuário não autenticado");
        setIsUploading(false);
        return;
      }

      // Check storage bucket is ready before attempting upload
      if (!storageBucketReady) {
        setUploadError("O sistema de armazenamento não está disponível no momento.");
        toast.error("Sistema de armazenamento indisponível");
        setIsUploading(false);
        return;
      }

      // Create a unique file path using user ID as folder
      const fileExt = file.name.split(".").pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setUploadError(uploadError.message);
        toast.error("Erro ao fazer upload da imagem.");
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update user data with new avatar URL
      setUserData({ ...userData, avatar_url: publicUrl });
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
        
      if (updateError) {
        console.error("Profile update error:", updateError);
        toast.error("Erro ao atualizar perfil no banco de dados.");
      } else {
        toast.success("Foto de perfil atualizada com sucesso!");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setUploadError("Erro desconhecido ao fazer upload.");
      toast.error("Ocorreu um erro ao atualizar sua foto de perfil");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-700 p-6 rounded-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4">Foto de Perfil</h3>
        <div className="space-y-4">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-dark-700 border border-zinc-700">
            {userData.avatar_url ? (
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={userData.avatar_url}
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="text-lg font-medium text-white">
                  {userData.full_name ? userData.full_name.charAt(0) : "?"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                {userData.full_name ? userData.full_name.charAt(0) : "?"}
              </div>
            )}
          </div>
          
          {uploadError && (
            <Alert variant="destructive" className="bg-danger-DEFAULT/20 border-danger-dark text-white">
              <Info className="h-4 w-4" />
              <AlertTitle>Erro ao acessar armazenamento</AlertTitle>
              <AlertDescription>
                {uploadError}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={retryStorageTest}
                    disabled={retryingStorageTest}
                    className="mt-2 bg-dark-700 border-zinc-700 text-white hover:bg-zinc-800"
                  >
                    {retryingStorageTest && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verificar acesso
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {!storageBucketReady ? (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-warning-DEFAULT" />
                <p className="text-warning-DEFAULT text-sm">Aguardando serviço de armazenamento...</p>
              </div>
              <p className="text-xs text-zinc-500">
                O upload de avatar estará disponível em instantes.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading || !storageBucketReady}
                  className="bg-dark-700 border-zinc-700 text-primary file:text-primary file:bg-transparent file:border-0 cursor-pointer hover:cursor-pointer file:cursor-pointer"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                      <span className="text-white text-sm">Enviando...</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                JPG, PNG ou GIF. Máximo 2MB.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
