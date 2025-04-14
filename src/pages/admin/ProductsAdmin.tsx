
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductCard from "@/components/admin/ProductCard";
import ProductForm from "@/components/admin/ProductForm";
import { useProducts } from "@/hooks/useProducts";

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

const ProductsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const {
    products,
    isLoading,
    isSaving,
    fetchProducts,
    saveProduct,
    deleteProduct,
    toggleProductStatus
  } = useProducts();
  
  // Carregar produtos quando o componente montar
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const openNewProductDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };
  
  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const handleSaveProduct = async (formData: any) => {
    const success = await saveProduct(formData, editingProduct);
    if (success) {
      setIsDialogOpen(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Gerenciar Produtos</h1>
          <Button onClick={openNewProductDialog} className="bg-primary hover:bg-primary/90 text-dark-700">
            <Plus className="h-5 w-5 mr-2" />
            Novo Produto
          </Button>
        </div>

        <p className="text-gray-400">
          Adicione, edite ou remova produtos do sistema.
        </p>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-400">Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={openEditProductDialog}
                onDelete={deleteProduct}
                onToggleStatus={toggleProductStatus}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-dark-700 text-white border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          
          <ProductForm
            product={editingProduct}
            isSaving={isSaving}
            onSave={handleSaveProduct}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ProductsAdmin;
