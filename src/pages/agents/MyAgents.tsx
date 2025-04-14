import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, MessageSquare, Activity, Settings, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  product_name: string;
  connection_name: string;
  created_at: string;
  user_id: string;
  product: string;
}

const MyAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, accountId } = useAuth();

  // Função auxiliar para recarregar os agentes
  const fetchAgents = async () => {
    try {
      let query = supabase.from("agents_connections").select("*");
      // Filtrar apenas pelo user_id
      if (user) {
        query = query.eq("user_id", user.id);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Mapear dados da tabela para o formato esperado
        const formattedAgents = data.map(agent => ({
          id: agent.id,
          name: agent.metadata?.agent_details?.name || "Agente",
          type: agent.metadata?.type || "default",
          status: agent.status,
          product_name: agent.metadata?.product_details?.name || "Produto",
          connection_name: agent.instance_name,
          created_at: agent.created_at,
          user_id: agent.user_id,
          product: agent.product
        }));
        
        setAgents(formattedAgents);
      }
    } catch (error) {
      console.error("Erro ao atualizar agentes:", error);
    }
  };
  
  // Fetch agents for the user/account
  useEffect(() => {
    const fetchAgentsForUser = async () => {
      try {
        setIsLoading(true);
        if (!user) return;
        
        // Buscar agentes apenas da tabela agents_connections
        let query = supabase.from("agents_connections").select("*");
        
        // Filtrar apenas pelo usuário (remover filtragem por account_id)
        query = query.eq("user_id", user.id);
        
        // Ordenar por data de criação, mais recentes primeiro
        const { data: agentsConnectionsData, error: agentsConnectionsError } = await query.order("created_at", { ascending: false });
        
        if (agentsConnectionsError) {
          console.error("Erro ao buscar da tabela agents_connections:", agentsConnectionsError);
          throw agentsConnectionsError;
        } else {
          console.log("Usando dados da tabela agents_connections");
          
          // Mapear dados da tabela para o formato esperado
          const formattedAgents = agentsConnectionsData.map(agent => ({
            id: agent.id,
            name: agent.metadata?.agent_details?.name || "Agente",
            type: agent.metadata?.type || "default",
            status: agent.status,
            product_name: agent.metadata?.product_details?.name || "Produto",
            connection_name: agent.instance_name,
            created_at: agent.created_at,
            user_id: agent.user_id,
            product: agent.product
          }));
          
          setAgents(formattedAgents || []);
        }
        
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching agents:", error);
        toast({
          title: "Erro ao carregar agentes",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchAgentsForUser();
  }, [toast, user, accountId]);

  const handleDeleteAgent = async (agentId: string) => {
    try {
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar autenticado para remover um agente.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualização otimista da UI
      setAgents(agents.filter(agent => agent.id !== agentId));
      
      // Deletar da tabela agents_connections
      const { error: agentsConnectionsError } = await supabase
        .from("agents_connections")
        .delete()
        .eq("id", agentId);
        
      if (agentsConnectionsError) {
        console.error("Erro ao deletar da tabela agents_connections:", agentsConnectionsError);
        throw agentsConnectionsError;
      }
      
      // Atualizar a lista de agentes
      await fetchAgents();
      
      toast({
        title: "Agente removido",
        description: "O agente foi removido com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao remover agente:", error);
      
      // Reverter atualização otimista em caso de erro
      await fetchAgents();
      
      toast({
        title: "Erro ao remover agente",
        description: error.message || "Ocorreu um erro ao tentar remover o agente.",
        variant: "destructive",
      });
    }
  };

  const handleAddAgent = () => {
    navigate("/agents/catalog");
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
            Ativo
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500">
            Inativo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
            Indisponível
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Meus Agentes</h2>
          <Button 
            onClick={handleAddAgent}
            className="bg-primary hover:bg-primary/90 text-dark-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Agente
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-dark-700 rounded-lg border border-zinc-800 p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhum agente ativado</h3>
            <p className="text-zinc-400 mb-6">Você ainda não tem nenhum agente ativado. Adicione um agente para começar a automatizar suas conversas.</p>
            <Button 
              onClick={handleAddAgent}
              className="bg-primary hover:bg-primary/90 text-dark-700"
            >
              Adicionar Agente
            </Button>
          </div>
        ) : (
          <div className="bg-dark-700 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-3 px-4 text-xs uppercase text-zinc-500 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 text-xs uppercase text-zinc-500 font-medium">Produto</th>
                    <th className="text-left py-3 px-4 text-xs uppercase text-zinc-500 font-medium">Conexão</th>
                    <th className="text-left py-3 px-4 text-xs uppercase text-zinc-500 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-xs uppercase text-zinc-500 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id} className="border-b border-zinc-800">
                      <td className="py-4 px-4 text-white">{agent.name}</td>
                      <td className="py-4 px-4 text-white">{agent.product_name}</td>
                      <td className="py-4 px-4 text-white">{agent.connection_name}</td>
                      <td className="py-4 px-4">{getStatusTag(agent.status)}</td>
                      <td className="py-4 px-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 hover:bg-zinc-700 text-white"
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 hover:bg-zinc-700 text-white"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="border-red-900/20 hover:bg-red-900/10 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgents;
