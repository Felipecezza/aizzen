import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentStatusSelector from "./AppointmentStatusSelector";
import { toast } from "sonner";
import { LeadFilters } from "./LeadFilters";
import { endOfDay, format, isAfter, isBefore, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LeadAppointmentManagerProps {
  productId: string;
  productTable: string;
}

const statusOptions = [
  { value: "Pendente", label: "Pendente", color: "bg-yellow-500" },
  { value: "Concluído", label: "Concluído", color: "bg-green-500" },
  { value: "Silenciado", label: "Silenciado", color: "bg-gray-500" }
];

const getStatusTextColor = (status: string | null): string => {
  switch (status) {
    case "Pendente":
      return "text-yellow-500";
    case "Concluído":
      return "text-green-500";
    case "Silenciado":
      return "text-gray-500";
    default:
      return "text-zinc-400";
  }
};

const getStatusDotColor = (status: string | null): string => {
  switch (status) {
    case "Pendente":
      return "bg-yellow-500";
    case "Concluído":
      return "bg-green-500";
    case "Silenciado":
      return "bg-gray-500";
    default:
      return "bg-zinc-400";
  }
};

const LeadAppointmentManager = ({ productId, productTable }: LeadAppointmentManagerProps) => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({});
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    pendingAppointments: 0,
    completedSales: 0
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchLeads(user.id);
      } else {
        toast.error("Usuário não autenticado");
      }
    };

    fetchUserData();
  }, [productId, productTable]);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  useEffect(() => {
    // Atualiza as métricas sempre que os leads mudarem
    const totalLeads = leads.length;
    const pendingAppointments = leads.filter(lead => lead.agendamento === "Concluído").length;
    const completedSales = leads.filter(lead => lead.agendamento === "Entregue").length;

    setMetrics({
      totalLeads,
      pendingAppointments,
      completedSales
    });
  }, [leads]);

  useEffect(() => {
    // Reset para primeira página quando os filtros mudarem
    setCurrentPage(1);
  }, [filters]);

  const fetchLeads = async (uid: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(productTable)
        .select("id, push_name, phone_number, agendamento, created_at, last_updated")
        .eq("product_id", productId)
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      toast.error("Não foi possível carregar os leads");
    } finally {
      setLoading(false);
    }
  };

  const refreshLeads = async () => {
    if (userId) {
      await fetchLeads(userId);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const applyFilters = () => {
    let result = [...leads];

    // Filtrar por nome
    if (filters.name) {
      result = result.filter(lead => 
        lead.push_name && lead.push_name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    // Filtrar por telefone
    if (filters.phone) {
      result = result.filter(lead => 
        lead.phone_number && lead.phone_number.includes(filters.phone!)
      );
    }

    // Filtrar por status
    if (filters.status) {
      result = result.filter(lead => lead.agendamento === filters.status);
    }

    // Filtrar por intervalo de datas
    if (filters.dateRange && filters.dateRange.from && filters.dateRange.to) {
      result = result.filter(lead => {
        try {
          const leadDate = parseISO(lead.created_at);
          return isWithinInterval(leadDate, {
            start: startOfDay(filters.dateRange!.from!),
            end: endOfDay(filters.dateRange!.to!)
          });
        } catch (e) {
          return false;
        }
      });
    }

    // Filtrar por intervalo de horário
    if (filters.timeRange && (filters.timeRange.from || filters.timeRange.to)) {
      result = result.filter(lead => {
        try {
          const leadDate = parseISO(lead.created_at);
          const leadTime = format(leadDate, 'HH:mm');
          
          if (filters.timeRange?.from && filters.timeRange.to) {
            // Verificar se está entre from e to
            return leadTime >= filters.timeRange.from && leadTime <= filters.timeRange.to;
          } else if (filters.timeRange?.from) {
            // Verificar se é depois de from
            return leadTime >= filters.timeRange.from;
          } else if (filters.timeRange?.to) {
            // Verificar se é antes de to
            return leadTime <= filters.timeRange.to;
          }
          
          return true;
        } catch (e) {
          return false;
        }
      });
    }

    setFilteredLeads(result);
  };

  const handleFilterChange = (newFilters: LeadFilters) => {
    setFilters(newFilters);
  };

  // Funções para controlar os diálogos e ações de pausa/ativação
  const handlePauseClick = (lead: any) => {
    setSelectedLead(lead);
    setPauseDialogOpen(true);
  };

  const handleActivateClick = (lead: any) => {
    if (lead.agendamento === "Silenciado") {
      // Se está silenciado, ativa direto para Pendente
      confirmActivate("Pendente");
    } else {
      // Se não está silenciado, mostra o popup para escolher o status
      setSelectedLead(lead);
      setActivateDialogOpen(true);
    }
  };

  const confirmPause = async () => {
    if (!selectedLead || !userId) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from(productTable)
        .update({ 
          agendamento: "Silenciado",
          last_updated: new Date().toISOString()
        })
        .eq("id", selectedLead.id)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast.success("Lead silenciado com sucesso");
      await refreshLeads();
    } catch (error) {
      console.error("Erro ao silenciar lead:", error);
      toast.error("Erro ao silenciar lead");
    } finally {
      setIsUpdating(false);
      setPauseDialogOpen(false);
    }
  };

  const confirmActivate = async (newStatus: string) => {
    if (!selectedLead || !userId) return;
    
    setIsUpdating(true);
    try {
      // Se o status atual é "Silenciado", só podemos mudar para "Pendente"
      const nextStatus = selectedLead.agendamento === "Silenciado" ? "Pendente" : newStatus;
      
      const { error } = await supabase
        .from(productTable)
        .update({ 
          agendamento: nextStatus,
          last_updated: new Date().toISOString()
        })
        .eq("id", selectedLead.id)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      toast.success(`Status atualizado para: ${nextStatus}`);
      await refreshLeads();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do lead");
    } finally {
      setIsUpdating(false);
      setActivateDialogOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Total de conversas</CardTitle>
            <p className="text-4xl font-bold text-cyan-500">{metrics.totalLeads}</p>
          </CardHeader>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Agendamentos pendentes</CardTitle>
            <p className="text-4xl font-bold text-yellow-500">{metrics.pendingAppointments}</p>
          </CardHeader>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">Vendas concluídas</CardTitle>
            <p className="text-4xl font-bold text-green-500">{metrics.completedSales}</p>
          </CardHeader>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Status dos Leads</CardTitle>
            <CardDescription>
              Gerencie o status dos seus leads
            </CardDescription>
          </div>
          <LeadFilters 
            currentFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <p className="text-center py-8 text-zinc-400">
              {leads.length === 0 ? "Nenhum lead encontrado para este produto." : "Nenhum lead corresponde aos filtros aplicados."}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className="border border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row gap-4 hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Coluna da esquerda - Informações do lead */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                        <div>
                          <h4 className="font-medium text-white text-base sm:text-lg">{lead.push_name || "Cliente"}</h4>
                          <p className="text-sm text-zinc-400 mt-0.5 sm:mt-1">{lead.phone_number || "Sem telefone"}</p>
                        </div>
                        <div className="text-right flex items-center justify-end">
                          <span className="text-xs text-zinc-500">
                            {formatDate(lead.last_updated || lead.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Coluna da direita - Status e ações */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 justify-start sm:justify-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-zinc-800 sm:pl-4">
                      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-500">Status atual:</span>
                            <div className={`h-2 w-2 rounded-full ${getStatusDotColor(lead.agendamento)}`}></div>
                            <span className={`text-sm font-medium ${getStatusTextColor(lead.agendamento)}`}>
                              {lead.agendamento || "Pendente"}
                            </span>
                          </div>
                        </div>
                        
                        {userId && (
                          <div className="flex items-center gap-3">
                            {lead.agendamento === "Silenciado" ? (
                              <div className="relative">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  className="relative h-9 sm:h-10 w-9 sm:w-10 bg-green-500/20 hover:bg-green-500/30 rounded-full border-0 p-0"
                                  onClick={() => confirmActivate("Pendente")}
                                  disabled={isUpdating}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 flex justify-center items-center">
                                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-green-500 border-b-[6px] border-b-transparent ml-1"></div>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="relative">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="relative h-9 sm:h-10 w-9 sm:w-10 bg-red-500/20 hover:bg-red-500/30 rounded-full border-0 p-0"
                                    onClick={() => handlePauseClick(lead)}
                                    disabled={isUpdating}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-2.5 h-4 flex gap-1">
                                        <div className="w-1 h-full bg-red-500 rounded-sm"></div>
                                        <div className="w-1 h-full bg-red-500 rounded-sm"></div>
                                      </div>
                                    </div>
                                  </Button>
                                </div>
                                
                                <Button
                                  variant="outline"
                                  className="px-3 sm:px-4 py-2 text-sm bg-transparent border-zinc-700 hover:bg-zinc-800 text-white"
                                  onClick={() => handleActivateClick(lead)}
                                  disabled={isUpdating}
                                >
                                  Alterar Status
                                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-zinc-700 bg-dark-800 hover:bg-dark-700 text-white"
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page 
                          ? "bg-primary hover:bg-primary/90" 
                          : "border-zinc-700 bg-dark-800 hover:bg-dark-700 text-white"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-zinc-700 bg-dark-800 hover:bg-dark-700 text-white"
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de Confirmação para Pausar */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent className="sm:max-w-md bg-dark-700 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Pausar Agente</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Tem certeza que deseja pausar este agente? O status será alterado para "Silenciado".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              className="border-zinc-700 bg-dark-800 hover:bg-dark-700 text-white"
              onClick={() => setPauseDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button 
              variant="default"
              onClick={confirmPause}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </div>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação para Ativar */}
      <Dialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <DialogContent className="sm:max-w-md bg-dark-700 border-zinc-700 text-white">
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedLead?.agendamento === "Silenciado" 
                ? "Reativar lead para status Pendente?"
                : "Escolha o novo status para este lead:"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 my-4">
            {selectedLead?.agendamento === "Silenciado" ? (
              <Button 
                variant="outline"
                className="border-zinc-700 hover:bg-dark-700 justify-start col-span-2"
                onClick={() => confirmActivate("Pendente")}
                disabled={isUpdating}
              >
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                Pendente
              </Button>
            ) : (
              statusOptions
                .filter(opt => opt.value !== "Silenciado" && opt.value !== selectedLead?.agendamento)
                .map((option) => (
                  <Button 
                    key={option.value}
                    variant="outline"
                    className="border-zinc-700 hover:bg-dark-700 justify-start"
                    onClick={() => confirmActivate(option.value)}
                    disabled={isUpdating}
                  >
                    <div className={`w-2 h-2 rounded-full ${option.color} mr-2`} />
                    {option.label}
                  </Button>
                ))
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-zinc-700 bg-dark-800 hover:bg-dark-700 text-white"
              onClick={() => setActivateDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadAppointmentManager; 