
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  description?: string;
  revenue?: number;
  pending?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  is_active?: boolean;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching products...");
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Products fetched:", data);
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async (formData: any, editingProduct: Product | null) => {
    if (isSaving) return false;
    
    try {
      setIsSaving(true);
      
      if (!formData.name) {
        toast({
          title: "Entrada inválida",
          description: "O nome do produto é obrigatório",
          variant: "destructive"
        });
        return false;
      }
      
      // Dados essenciais para criar/atualizar um produto
      const productData = {
        name: formData.name,
        description: formData.description || "",
        image_url: formData.image_url || null,
      };
      
      console.log(editingProduct ? "Updating product:" : "Creating new product:", productData);
      
      if (editingProduct) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        toast({
          title: "Produto atualizado",
          description: "As alterações foram salvas com sucesso"
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        
        toast({
          title: "Produto criado",
          description: "O novo produto foi adicionado com sucesso"
        });
      }
      
      // Atualizar a lista de produtos
      fetchProducts();
      return true;
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o produto",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      console.log(`Toggling product status (${productId}) to:`, newStatus);
      
      const { error } = await supabase
        .from('products')
        .update({ is_active: newStatus })
        .eq('id', productId);
      
      if (error) {
        console.error("Toggle status error:", error);
        throw error;
      }
      
      toast({
        title: newStatus ? "Produto ativado" : "Produto desativado",
        description: `O produto foi ${newStatus ? "ativado" : "desativado"} com sucesso`
      });
      
      // Atualiza localmente para evitar uma nova consulta ao banco
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_active: newStatus } : p
      ));
      
      return true;
    } catch (error: any) {
      console.error("Error toggling product status:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível alterar o status do produto",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }
    
    try {
      console.log("Deleting product:", productId);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      
      console.log("Product deleted successfully");
      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso"
      });
      
      fetchProducts();
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível excluir o produto",
        variant: "destructive"
      });
    }
  };

  return {
    products,
    isLoading,
    isSaving,
    fetchProducts,
    saveProduct,
    deleteProduct,
    toggleProductStatus
  };
};
