import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Users, BarChart2, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  revenue: number;
  pending: number;
}

const Products = () => {
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Products fetched:", data);
      return data as Product[];
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="container py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-[360px] w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="container py-8">
          <div className="text-destructive">
            Erro ao carregar produtos. Por favor, tente novamente.
          </div>
        </div>
      </div>
    );
  }

  // Function to render 5 stars
  const renderStars = () => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star key={index} className="h-4 w-4 text-primary fill-primary" />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Produtos</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden shadow-md flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:translate-y-[-2px]"
              >
                <div className="h-48 relative">
                  <img 
                    src={product.image_url || "/placeholder.svg"} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white line-clamp-1">{product.name}</h3>
                  </div>
                  
                  <div className="mt-2 mb-auto">
                    {renderStars()}
                  </div>

                  <Link to={`/products/${product.id}/leads`} className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center justify-between border-zinc-700 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Gerenciar Leads
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary-dark text-primary-foreground rounded-md"
                    onClick={() => console.log(`More details for ${product.name}`)}
                  >
                    Mais Detalhes
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-zinc-500 py-8 bg-dark-700 border border-zinc-800 rounded-lg">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
