
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ProductImageUploaderProps {
  imageUrl: string | null;
  onImageUpload: (url: string) => void;
}

const ProductImageUploader = ({ imageUrl, onImageUpload }: ProductImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // We'll use the existing 'avatars' bucket with our newly created policies
      const bucketName = 'avatars';
      
      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      onImageUpload(urlData.publicUrl);
      
      toast({
        title: "Imagem carregada",
        description: "A imagem do produto foi carregada com sucesso.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível carregar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };
  
  const handleRemoveImage = () => {
    onImageUpload('');
    toast({
      title: "Imagem removida",
      description: "A imagem do produto foi removida.",
    });
  };
  
  return (
    <div className="space-y-2">
      <div className="h-44 w-full rounded-lg border border-zinc-800 overflow-hidden bg-dark-800">
        {imageUrl ? (
          <div className="relative h-full">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <ImageIcon className="h-12 w-12 text-zinc-700" />
            <span className="text-sm">Nenhuma imagem selecionada</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-zinc-700 text-white hover:bg-zinc-700"
          disabled={isUploading}
          onClick={() => document.getElementById('productImage')?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Carregando...' : 'Carregar imagem'}
        </Button>
        <input
          id="productImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ProductImageUploader;
