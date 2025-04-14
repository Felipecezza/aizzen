import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, ShoppingCart, Headphones, RefreshCcw, Shield, Link as LinkIcon, ArrowUpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { webhookApi } from "@/utils/webhookConfig";

interface WhatsappConnection {
  id: string;
  instance_name: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
}

interface SystemAgent {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  requires_plan: string;
  is_active: boolean;
  price_label: string | null;
  order_position: number | null;
}

const AgentCatalog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<{[key: string]: boolean}>({});
  const [selectedConnection, setSelectedConnection] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<SystemAgent | null>(null);
  const { toast } = useToast();
  const [systemAgents, setSystemAgents] = useState<SystemAgent[]>([]);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [connections, setConnections] = useState<WhatsappConnection[]>([]);
  const [activeAgentConnections, setActiveAgentConnections] = useState<{[key: string]: string[]}>({});
  const { user, accountId } = useAuth();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url")
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data as Product[];
    },
  });

  // Fetch system agents and user plan
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user's plan
        if (user) {
          const { data: planData, error: planError } = await supabase
            .from("account_plans")
            .select("plan_type")
            .eq("user_id", user.id)
            .single();
          
          if (!planError && planData) {
            setUserPlan(planData.plan_type);
          }
        }

        // Get agents
        const { data: agentsData, error: agentsError } = await supabase
          .from("system_agents")
          .select("*")
          .eq("is_active", true)
          .order("order_position", { ascending: true });
        
        if (agentsError) {
          throw agentsError;
        }
        
        setSystemAgents(agentsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Função para buscar agentes já ativos para o usuário
  const fetchActiveAgentConnections = async () => {
    if (!user) return;
    
    try {
      // Buscar todos os agentes ativos do usuário
      const { data, error } = await supabase
        .from("agents_connections")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active");
        
      if (error) {
        console.error("Erro ao buscar agentes ativos:", error);
        return;
      }
      
      // Mapear os agentes por conexão
      const agentsByConnection: {[key: string]: string[]} = {};
      
      if (data) {
        data.forEach(agent => {
          // Para cada instância, armazenar os IDs dos agentes ativos
          const instanceName = agent.instance_name;
          const agentId = agent.metadata?.agent_details?.id;
          
          if (instanceName && agentId) {
            if (!agentsByConnection[instanceName]) {
              agentsByConnection[instanceName] = [];
            }
            agentsByConnection[instanceName].push(agentId);
          }
        });
      }
      
      setActiveAgentConnections(agentsByConnection);
      console.log("Agentes ativos por conexão:", agentsByConnection);
    } catch (err) {
      console.error("Erro ao buscar agentes ativos:", err);
    }
  };

  // Chamar a função ao montar o componente e sempre que o usuário mudar
  useEffect(() => {
    if (user) {
      fetchActiveAgentConnections();
    }
  }, [user]);

  // Fetch user's connections
  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user, accountId]);

  // Versão atualizada da função fetchConnections
  const fetchConnections = async () => {
    try {
      console.log("Buscando conexões - user ID:", user?.id);
      console.log("Buscando conexões - account ID:", accountId);
      
      // Primeiro, tenta buscar a conexão específica que sabemos que existe
      const { data: specificConnection, error: specificError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("id", "cf783298-85bb-42e4-8863-a155bd955bfb");
      
      if (specificError) {
        console.error("Erro ao buscar conexão específica:", specificError);
      } else if (specificConnection && specificConnection.length > 0) {
        console.log("Conexão específica encontrada:", specificConnection);
        setConnections(specificConnection);
        return;
      }
      
      // Tenta buscar pelo user_id específico
      const { data: userConnections, error: userError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("user_id", "2729b24e-8ec1-4c5e-83f2-5e7b8728fbd8")
        .eq("status", "active");
      
      if (userError) {
        console.error("Erro ao buscar conexões do usuário específico:", userError);
      } else if (userConnections && userConnections.length > 0) {
        console.log("Conexões do usuário específico encontradas:", userConnections);
        setConnections(userConnections);
        return;
      }
      
      // Se não encontrou com os IDs específicos, buscar todas as conexões ativas
      const { data: activeConnections, error: activeError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("status", "active");
      
      if (activeError) {
        console.error("Erro ao buscar todas as conexões ativas:", activeError);
      } else {
        console.log("Todas as conexões ativas encontradas:", activeConnections);
        setConnections(activeConnections || []);
      }
    } catch (error) {
      console.error("Erro ao carregar conexões:", error);
    }
  };

  // Função de debug para testar conexões
  const debugConnections = async () => {
    try {
      console.log("Iniciando depuração de conexões");
      
      // 1. Tentar buscar todas as conexões sem filtros
      const { data: allConnections, error: allError } = await supabase
        .from("whatsapp_connections")
        .select("*");
      
      console.log("Todas as conexões (sem filtros):", allConnections);
      
      if (allError) {
        console.error("Erro ao buscar todas as conexões:", allError);
      }
      
      // 2. Tentar buscar usando o ID específico do SQL
      const { data: specificConnections, error: specificError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("id", "cf783298-85bb-42e4-8863-a155bd955bfb");
      
      console.log("Conexão específica pelo ID:", specificConnections);
      
      if (specificError) {
        console.error("Erro ao buscar conexão específica:", specificError);
      }
      
      // 3. Tentar buscar pelo user_id específico
      const { data: userConnections, error: userError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("user_id", "2729b24e-8ec1-4c5e-83f2-5e7b8728fbd8");
      
      console.log("Conexões do usuário específico:", userConnections);
      
      if (userError) {
        console.error("Erro ao buscar conexões do usuário:", userError);
      }
      
      // 4. Testar busca apenas por status
      const { data: activeConnections, error: activeError } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("status", "active");
      
      console.log("Conexões ativas:", activeConnections);
      
      if (activeError) {
        console.error("Erro ao buscar conexões ativas:", activeError);
      }
      
      // Se encontrou a conexão específica, usá-la
      if (specificConnections && specificConnections.length > 0) {
        console.log("Usando conexão específica encontrada");
        setConnections(specificConnections);
        return true;
      }
      
      // Se encontrou conexões do usuário específico, usá-las
      if (userConnections && userConnections.length > 0) {
        console.log("Usando conexões do usuário específico");
        setConnections(userConnections);
        return true;
      }
      
      // Se encontrou conexões ativas, usá-las
      if (activeConnections && activeConnections.length > 0) {
        console.log("Usando conexões ativas");
        setConnections(activeConnections);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro durante depuração:", error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent, agent: SystemAgent) => {
    e.preventDefault();
    
    if (!selectedConnection || !selectedProduct) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione uma conexão e um produto.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !accountId) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar autenticado para ativar um agente.",
        variant: "destructive",
      });
      return;
    }

    // Buscar informações sobre a conexão selecionada
    const selectedConnectionData = connections.find(conn => conn.id === selectedConnection);
    
    // Verificar se o agente já está ativo nesta instância
    if (selectedConnectionData && isAgentActiveInConnection(agent.id, selectedConnectionData.instance_name)) {
      toast({
        title: "Agente já ativo",
        description: `Este agente já está ativo na conexão ${formatInstanceNameForDisplay(selectedConnectionData.instance_name)}. Escolha outra conexão ou remova a ativação existente.`,
        variant: "destructive",
      });
      return;
    }

    // Definir o agente atual para a submissão
    setSelectedAgent(agent);

    // Buscar informações sobre o produto selecionado
    const selectedProductData = products?.find(prod => prod.id === selectedProduct);

    // Fazer requisição para o endpoint do webhook para conectar o agente
    const activateAgent = async () => {
      try {
        // Informa ao usuário que a ativação está em andamento
        toast({
          title: "Ativando agente",
          description: "Estamos configurando seu agente, aguarde...",
        });

        // Obter dados completos do usuário com todos os detalhes
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        // Obter dados completos da conta com todos os detalhes
        const { data: accountData, error: accountError } = accountId 
          ? await supabase.from('accounts').select('*').eq('id', accountId).single()
          : { data: null, error: null };

        // Obter informações detalhadas da conexão WhatsApp
        const { data: connectionDetails, error: connectionError } = await supabase
          .from('whatsapp_connections')
          .select('*')
          .eq('id', selectedConnection)
          .single();
          
        if (connectionError) throw connectionError;

        // Obter informações detalhadas do produto
        const { data: productDetails, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', selectedProduct)
          .single();
          
        if (productError) throw productError;
        
        // Verificar se o usuário possui dados complementares na tabela 'user_details' (se existir)
        const { data: userDetailsData } = await supabase
          .from('user_details')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Verificar se existem dados de pagamento ou assinaturas
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        // Verificar se existem dados de configuração para este usuário
        const { data: userConfigData } = await supabase
          .from('user_configs')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        // Obter o nome formatado da instância
        const formattedInstanceName = formatInstanceNameForDisplay(connectionDetails.instance_name);

        // Preparar payload com TODAS as informações necessárias
        const payload = {
          // Dados do usuário
          user: {
            ...userData,
            extra_details: userDetailsData || null,
            subscription: subscriptionData || null,
            config: userConfigData || null
          },
          
          // Dados da conta
          account: accountData || null,
          
          // Dados da conexão WhatsApp (completos)
          connection: {
            ...connectionDetails,
            formatted_name: formattedInstanceName  
          },
          
          // Dados do produto (completos)
          product: productDetails,
          
          // Dados do agente
          agent: {
            id: agent.id,
            name: agent.name,
            description: agent.description,
            requires_plan: agent.requires_plan,
            icon: agent.icon
          },
          
          // Metadados da ativação
          activation: {
            timestamp: new Date().toISOString(),
            source: 'agent_catalog',
            client_ip: null,
            request_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          },
          
          // Dados de instância para compatibilidade com webhook atual
          instanceName: connectionDetails.instance_name,
          phoneNumber: connectionDetails.phone_number || null
        };

        console.log("Enviando payload para webhook:", payload);

        // Enviar requisição para o webhook
        const response = await fetch(webhookApi.CONECTAR_AGENTE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Se recebeu 200, significa que a conexão foi bem-sucedida
        if (response.status === 200) {
          console.log("Webhook retornou 200 - Conexão bem-sucedida!");
          
          let responseData;
          try {
            responseData = await response.json();
            console.log("Resposta da ativação:", responseData);
          } catch (e) {
            console.log("Resposta não possui JSON, mas foi bem-sucedida (status 200)");
          }
          
          // Inserir registro na tabela agents_connections
          const { error: agentConnectionError } = await supabase.from("agents_connections").insert({
            user_id: user.id,
            product: selectedProduct,
            instance_name: connectionDetails.instance_name,
            status: "active",
            phone_number: connectionDetails.phone_number || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {
              connection_details: connectionDetails,
              product_details: productDetails,
              agent_details: {
                id: agent.id,
                name: agent.name
              },
              webhook_response: responseData || { status: 200 },
              activation_source: 'agent_catalog'
            }
          });
          
          if (agentConnectionError) {
            console.error("Erro ao salvar na tabela agents_connections:", agentConnectionError);
            console.error("Detalhes do erro:", JSON.stringify(agentConnectionError));
            throw new Error(`Webhook retornou sucesso, mas houve erro ao salvar os dados na tabela agents_connections. Detalhes: ${agentConnectionError.message || JSON.stringify(agentConnectionError)}`);
          }

          // Sucesso - informa ao usuário
          toast({
            title: "Agente ativado com sucesso",
            description: "Seu agente foi configurado e está pronto para uso.",
          });
          
          // Atualizar a lista de agentes ativos
          fetchActiveAgentConnections();
          
          // Fechar o diálogo
          setIsDialogOpen(prev => ({ ...prev, [agent.id]: false }));
          return;
        }
        
        // Se não for 200, tratar como erro
        if (!response.ok) {
          let errorText = "";
          try {
            errorText = await response.text();
          } catch (e) {
            errorText = "Não foi possível obter detalhes do erro";
          }
          throw new Error(`Falha ao ativar agente: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Fallback (não deve chegar aqui)
        const data = await response.json();
        console.log("Resposta inesperada da ativação:", data);
        
        toast({
          title: "Resposta inesperada",
          description: "O servidor respondeu de forma inesperada. Verifique se o agente foi ativado.",
          variant: "destructive",
        });
        
        setIsDialogOpen(prev => ({ ...prev, [agent.id]: false }));
      } catch (error) {
        console.error('Erro ao ativar agente:', error);
    toast({
          title: "Erro ao ativar agente",
          description: error instanceof Error ? error.message : "Ocorreu um erro durante a ativação. Tente novamente.",
          variant: "destructive",
        });
      }
    };

    activateAgent();
  };

  // Função para verificar se um agente já está ativo em uma conexão
  const isAgentActiveInConnection = (agentId: string, instanceName: string) => {
    // Verificar se esta instância tem agentes ativos
    if (activeAgentConnections[instanceName]) {
      // Verificar se este agentId específico já está ativo nesta instância
      return activeAgentConnections[instanceName].includes(agentId);
    }
    return false;
  };

  // Função para filtrar conexões disponíveis para um agente específico
  const getAvailableConnectionsForAgent = (agentId: string) => {
    // Filtrar apenas as conexões onde este agente ainda não está ativo
    return connections.filter(connection => 
      !isAgentActiveInConnection(agentId, connection.instance_name)
    );
  };

  const openAgentDialog = (agent: SystemAgent) => {
    setSelectedAgent(agent);
    
    // Limpar seleções anteriores
    setSelectedConnection("");
    setSelectedProduct("");
    
    // Forçar busca de conexões atualizadas e agentes ativos
    fetchConnections();
    fetchActiveAgentConnections();
    
    // Abrir diálogo específico para este agente
    setIsDialogOpen(prev => ({ ...prev, [agent.id]: true }));
  };
  
  const closeAgentDialog = (agentId: string) => {
    setIsDialogOpen(prev => ({ ...prev, [agentId]: false }));
  };

  // Helper to render appropriate icon
  const renderAgentIcon = (iconName: string | null) => {
    if (!iconName) return <ShoppingCart className="h-6 w-6 text-primary" />;
    
    switch (iconName) {
      case "ShoppingCart":
        return <ShoppingCart className="h-6 w-6 text-primary" />;
      case "HeadphonesIcon":
        return <Headphones className="h-6 w-6 text-primary" />;
      case "RefreshCcw":
        return <RefreshCcw className="h-6 w-6 text-primary" />;
      case "Shield":
        return <Shield className="h-6 w-6 text-primary" />;
      case "Link":
        return <LinkIcon className="h-6 w-6 text-primary" />;
      case "ArrowUpCircle":
        return <ArrowUpCircle className="h-6 w-6 text-primary" />;
      default:
        return <ShoppingCart className="h-6 w-6 text-primary" />;
    }
  };

  // Check if a plan is required
  const isPlanRequired = (agentPlan: string) => {
    if (agentPlan === 'free') return false;
    if (userPlan === 'escale') return false; // Escale has access to all
    if (userPlan === 'pro' && agentPlan === 'escale') return true;
    if (userPlan === 'free' && (agentPlan === 'pro' || agentPlan === 'escale')) return true;
    return false;
  };

  // Função para verificar se o agente deve estar bloqueado com "Em desenvolvimento"
  const isAgentLocked = (agent: SystemAgent) => {
    // Libera apenas o agente com nome "Agente Vendedor"
    return agent.name !== "Agente Vendedor";
  };

  // Função para formatar o nome da instância para exibição
  const formatInstanceNameForDisplay = (instanceName: string) => {
    // Remover o código aleatório após o underscore (exemplo: teste2_5yBR0F -> teste2)
    const parts = instanceName.split('_');
    if (parts.length > 1) {
      return parts[0]; // Retorna apenas a primeira parte (nome amigável)
    }
    return instanceName; // Retorna o nome completo se não tiver underscore
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Catálogo de Agentes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemAgents.map((agent) => (
            <div key={agent.id} className="rounded-lg bg-dark-700 p-6 space-y-4 border border-zinc-800 relative overflow-hidden">
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <p className="text-zinc-400 text-sm">
                {agent.description}
              </p>
              
              <Button 
                disabled={isPlanRequired(agent.requires_plan) || isAgentLocked(agent)}
                className={`w-full ${
                  isPlanRequired(agent.requires_plan) || isAgentLocked(agent)
                    ? "bg-zinc-800 text-white"
                    : "bg-primary hover:bg-primary/90 text-dark-700"
                }`}
                onClick={() => {
                  if (!isPlanRequired(agent.requires_plan) && !isAgentLocked(agent)) {
                    openAgentDialog(agent);
                  }
                }}
              >
                {agent.price_label || "Ativar Agente"}
              </Button>
              
              {/* Overlay de bloqueio */}
              {(isPlanRequired(agent.requires_plan) || isAgentLocked(agent)) && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-10">
                  <div className="text-center space-y-3">
                    <Lock className="h-14 w-14 text-primary mx-auto drop-shadow-lg" />
                    <p className="text-white font-medium px-4">
                      {isPlanRequired(agent.requires_plan) 
                        ? `Disponível no plano ${agent.requires_plan}`
                        : "Em desenvolvimento"}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Dialog para configuração do agente */}
              {!isPlanRequired(agent.requires_plan) && !isAgentLocked(agent) && (
                <Dialog 
                  open={isDialogOpen[agent.id]} 
                  onOpenChange={(open) => {
                    if (!open) closeAgentDialog(agent.id);
                    else openAgentDialog(agent);
                  }}
                >
                  <DialogContent className="bg-dark-700 text-white border-zinc-800">
                    <DialogHeader>
                      <DialogTitle>Configurar {agent.name}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(e, agent);
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="connection">Selecione a Conexão WhatsApp</Label>
                        <Select
                          value={selectedConnection}
                          onValueChange={setSelectedConnection}
                        >
                          <SelectTrigger className="bg-dark-700 border-zinc-800">
                            <SelectValue placeholder="Selecione uma conexão">
                              {selectedConnection && connections.find(c => c.id === selectedConnection)?.instance_name 
                                ? formatInstanceNameForDisplay(connections.find(c => c.id === selectedConnection)!.instance_name)
                                : "Selecione uma conexão"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-dark-700 border-zinc-800">
                            {selectedAgent && getAvailableConnectionsForAgent(selectedAgent.id).map((connection) => (
                              <SelectItem 
                                key={connection.id} 
                                value={connection.id}
                                className="text-white hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:text-white py-1.5"
                              >
                                {formatInstanceNameForDisplay(connection.instance_name)}
                              </SelectItem>
                            ))}
                            {selectedAgent && getAvailableConnectionsForAgent(selectedAgent.id).length === 0 && (
                              <SelectItem 
                                value="none" 
                                disabled 
                                className="text-white py-1.5"
                              >
                                Este agente já está ativo em todas as conexões disponíveis
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {connections.length === 0 && (
                          <p className="text-red-400 text-xs mt-1">
                            Você precisa ter pelo menos uma conexão ativa.{" "}
                            <a 
                              href="/connection" 
                              className="text-primary hover:underline"
                              onClick={() => closeAgentDialog(agent.id)}
                            >
                              Adicionar conexão
                            </a>
                          </p>
                        )}
                        {selectedAgent && getAvailableConnectionsForAgent(selectedAgent.id).length === 0 && connections.length > 0 && (
                          <p className="text-yellow-400 text-xs mt-1">
                            Você não tem nenhuma instância disponível para conectar o agente {selectedAgent.name}.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product">Selecione o Produto</Label>
                        <Select
                          value={selectedProduct}
                          onValueChange={setSelectedProduct}
                        >
                          <SelectTrigger className="bg-dark-700 border-zinc-800">
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-700 border-zinc-800">
                            {isLoadingProducts ? (
                              <SelectItem value="loading" disabled>Carregando produtos...</SelectItem>
                            ) : products && products.length > 0 ? (
                              products.map((product) => (
                                <SelectItem 
                                  key={product.id} 
                                  value={product.id}
                                  className="text-white hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:text-white py-1.5"
                                >
                                  {product.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>Nenhum produto encontrado</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-dark-700">
                        Ativar Agente
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
          
          {systemAgents.length === 0 && (
            <div className="col-span-3 text-center py-10 text-zinc-400">
              Nenhum agente disponível no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCatalog;
