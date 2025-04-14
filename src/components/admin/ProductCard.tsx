
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  description?: string;
  revenue?: number;
  pending?: number;
  is_active?: boolean;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
}

const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }: ProductCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    await onToggleStatus(product.id, product.is_active || false);
    setIsUpdating(false);
  };

  const isActive = product.is_active !== false; // true por padrão se não definido

  return (
    <div className="bg-dark-700 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="h-40 bg-dark-800 relative">
        {!isActive && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="bg-red-500/80 text-white px-2 py-1 rounded text-sm">
              Inativo
            </span>
          </div>
        )}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package className="h-12 w-12 text-zinc-700" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-white">{product.name}</h3>

        {product.description && (
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
            {product.description}
          </p>
        )}

        {product.revenue !== undefined && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Receita:</span>
              <span className="text-white">
                R$ {product.revenue.toFixed(2)}
              </span>
            </div>

            {product.pending !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pendente:</span>
                <span className="text-white">
                  R$ {product.pending.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="flex-1 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="flex-1 border-zinc-700 text-red-400 hover:bg-red-400/20 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleStatus}
          disabled={isUpdating}
          className={`mt-2 w-full ${isActive 
            ? 'text-green-400 hover:text-green-500 hover:bg-green-400/10' 
            : 'text-red-400 hover:text-red-500 hover:bg-red-400/10'}`}
        >
          {isUpdating ? (
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-1" />
          ) : isActive ? (
            <ToggleRight className="h-5 w-5 mr-1" />
          ) : (
            <ToggleLeft className="h-5 w-5 mr-1" />
          )}
          {isActive ? "Ativo" : "Inativo"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
