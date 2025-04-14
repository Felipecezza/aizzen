import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import LeadAppointmentManager from "@/components/leads/LeadAppointmentManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductLeads = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productTable, setProductTable] = useState("");

  useEffect(() => {
    if (!productId) {
      toast.error("ID do produto não especificado");
      navigate("/products");
      return;
    }

    const fetchProductData = async () => {
      setLoading(true);
      try {
        // Buscar dados do produto
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (productError) throw productError;
        
        setProductData(product);
        
        // Determinar nome da tabela de leads
        if (product) {
          const { data: tableData, error: tableError } = await supabase
            .from("product_tables")
            .select("table_name")
            .eq("product_id", productId)
            .single();
            
          if (tableError) {
            console.error("Erro ao buscar tabela do produto:", tableError);
            // Tentar criar nome da tabela baseado no nome do produto
            const sanitizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
            setProductTable(`lead_${sanitizedName}`);
          } else if (tableData) {
            setProductTable(tableData.table_name);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do produto:", error);
        toast.error("Não foi possível carregar os dados do produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, navigate]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              className="relative h-9 sm:h-10 w-12 sm:w-14 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border-0 p-0"
              onClick={() => navigate("/products")}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 flex justify-center items-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-r-[10px] border-r-zinc-400 border-b-[6px] border-b-transparent mr-1"></div>
                </div>
              </div>
            </Button>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {loading ? "Carregando..." : productData?.name || "Leads do produto"}
          </h1>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-8 sm:h-10 w-8 sm:w-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <LeadAppointmentManager 
            productId={productId || ""} 
            productTable={productTable}
          />
        </div>
      )}
    </div>
  );
};

export default ProductLeads; 