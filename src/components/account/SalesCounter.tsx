import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SalesCounterProps {
  userId: string;
}

const SalesCounter = ({ userId }: SalesCounterProps) => {
  const [loading, setLoading] = useState(true);
  const [salesCount, setSalesCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        // Buscar contagem de vendas concluídas
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'Concluído');
        
        if (salesError) throw salesError;
        
        if (salesData) {
          setSalesCount(salesData.length);
          
          // Calcular receita total
          const totalRevenue = salesData.reduce((sum, order) => {
            return sum + (order.total || 0);
          }, 0);
          
          setRevenue(totalRevenue);
        }
      } catch (error) {
        console.error("Erro ao buscar dados de vendas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalesData();
  }, [userId]);
  
  return (
    <div className="rounded-lg bg-dark-700 p-6 border border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Vendas Concluídas</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-16">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400 mb-1">Total de Vendas</p>
            <p className="text-2xl font-bold text-white">{salesCount}</p>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-400 mb-1">Receita Total</p>
            <p className="text-2xl font-bold text-green-500">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(revenue)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCounter; 