
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { 
  Users, PlusCircle, AlertTriangle, CheckCircle2, 
  XCircle, Edit, Trash2, ShoppingCart, ShieldAlert, Headphones, RefreshCcw, Link as LinkIcon, ArrowUpCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

const AgentsAdmin = () => {
  const [agents, setAgents] = useState<SystemAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<SystemAgent | null>(null);
  const [newAgent, setNewAgent] = useState<Partial<SystemAgent>>({
    name: "",
    description: "",
    icon: "",
    requires_plan: "free",
    is_active: true,
    price_label: "",
    order_position: 0
  });

  // Available plan types
  const planTypes = ["free", "pro", "senior"];
  
  // Available icons
  const icons = [
    { icon: "ShoppingCart", label: "Shopping Cart" },
    { icon: "HeadphonesIcon", label: "Headphones" },
    { icon: "MessageSquare", label: "Message" },
    { icon: "RefreshCcw", label: "Refresh" },
    { icon: "Shield", label: "Shield" },
    { icon: "Link", label: "Link" },
    { icon: "ArrowUpCircle", label: "Arrow Up" },
    { icon: "BarChart", label: "Chart" }
  ];

  // Fetch agents from database
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("system_agents")
        .select("*")
        .order("order_position", { ascending: true });

      if (error) {
        throw error;
      }

      setAgents(data || []);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Erro ao carregar agentes",
        description: "Não foi possível carregar a lista de agentes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Toggle agent active status
  const toggleAgentStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("system_agents")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update local state
      setAgents(
        agents.map((agent) =>
          agent.id === id
            ? { ...agent, is_active: !currentStatus }
            : agent
        )
      );

      toast({
        title: "Status atualizado",
        description: `Agente ${!currentStatus ? "ativado" : "desativado"} com sucesso`,
      });
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agente",
        variant: "destructive",
      });
    }
  };

  // Open delete dialog
  const openDeleteDialog = (agent: SystemAgent) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  // Delete agent
  const deleteAgent = async () => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from("system_agents")
        .delete()
        .eq("id", selectedAgent.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAgents(agents.filter((agent) => agent.id !== selectedAgent.id));
      setIsDeleteDialogOpen(false);
      setSelectedAgent(null);

      toast({
        title: "Agente excluído",
        description: "O agente foi excluído com sucesso",
      });
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Erro ao excluir agente",
        description: "Não foi possível excluir o agente",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog
  const openEditDialog = (agent: SystemAgent) => {
    setSelectedAgent(agent);
    setIsEditDialogOpen(true);
  };

  // Update agent
  const updateAgent = async () => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from("system_agents")
        .update(selectedAgent)
        .eq("id", selectedAgent.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAgents(
        agents.map((agent) =>
          agent.id === selectedAgent.id ? selectedAgent : agent
        )
      );
      setIsEditDialogOpen(false);
      setSelectedAgent(null);

      toast({
        title: "Agente atualizado",
        description: "O agente foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Error updating agent:", error);
      toast({
        title: "Erro ao atualizar agente",
        description: "Não foi possível atualizar o agente",
        variant: "destructive",
      });
    }
  };

  // Add new agent
  const addAgent = async () => {
    try {
      const { data, error } = await supabase
        .from("system_agents")
        .insert(newAgent)
        .select();

      if (error) {
        throw error;
      }

      // Update local state
      if (data && data.length > 0) {
        setAgents([...agents, data[0]]);
      }
      
      setIsAddDialogOpen(false);
      setNewAgent({
        name: "",
        description: "",
        icon: "",
        requires_plan: "free",
        is_active: true,
        price_label: "",
        order_position: 0
      });

      toast({
        title: "Agente adicionado",
        description: "O novo agente foi adicionado com sucesso",
      });
    } catch (error) {
      console.error("Error adding agent:", error);
      toast({
        title: "Erro ao adicionar agente",
        description: "Não foi possível adicionar o agente",
        variant: "destructive",
      });
    }
  };

  // Render icon component
  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <Users className="h-5 w-5 text-gray-400" />;
    
    switch (iconName) {
      case "ShoppingCart":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case "HeadphonesIcon":
        return <Headphones className="h-5 w-5 text-green-500" />;
      case "Shield":
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
      case "RefreshCcw":
        return <RefreshCcw className="h-5 w-5 text-purple-500" />;
      case "Link":
        return <LinkIcon className="h-5 w-5 text-rose-500" />;
      case "ArrowUpCircle":
        return <ArrowUpCircle className="h-5 w-5 text-indigo-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-400" />;
    }
  };

  // Render plan badge
  const renderPlanBadge = (plan: string) => {
    switch (plan) {
      case "free":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Free</Badge>;
      case "pro":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">Pro</Badge>;
      case "escale":
        return <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Escale</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30">{plan}</Badge>;
    }
  };

  return (
    <SuperAdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Gerenciamento de Agentes</h1>
            <Button 
              className="bg-primary text-dark-900 hover:bg-primary/90"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Agente
            </Button>
          </div>
          
          <p className="text-gray-400">
            Gerencie os agentes disponíveis para os usuários. Você pode ativar, desativar, editar e excluir agentes.
          </p>

          <div className="rounded-md border border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50">
                  <TableHead className="text-zinc-400">Agente</TableHead>
                  <TableHead className="text-zinc-400">Descrição</TableHead>
                  <TableHead className="text-zinc-400">Plano Requerido</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-zinc-400">
                      Carregando agentes...
                    </TableCell>
                  </TableRow>
                ) : agents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-zinc-400">
                      Nenhum agente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  agents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-zinc-800/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          {renderIcon(agent.icon)}
                          {agent.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300 max-w-md truncate">
                        {agent.description || "Sem descrição"}
                      </TableCell>
                      <TableCell className="text-zinc-300">
                        {renderPlanBadge(agent.requires_plan)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={agent.is_active} 
                            onCheckedChange={() => toggleAgentStatus(agent.id, agent.is_active)}
                          />
                          <span className={agent.is_active ? 'text-green-500' : 'text-red-500'}>
                            {agent.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 border-zinc-700 bg-dark-700"
                            onClick={() => openEditDialog(agent)}
                          >
                            <Edit className="h-4 w-4 text-zinc-400" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 border-zinc-700 bg-dark-700"
                            onClick={() => openDeleteDialog(agent)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Delete Agent Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-dark-700 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Excluir Agente</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Tem certeza que deseja excluir o agente "{selectedAgent?.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 border border-zinc-700 rounded-md bg-dark-800 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-zinc-300 text-sm">
                A exclusão deste agente irá removê-lo da lista de agentes disponíveis para todos os usuários.
              </p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-zinc-700 text-white" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteAgent}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Agent Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-dark-700 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Agente</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Atualize as informações do agente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome do Agente</Label>
                <Input 
                  id="name" 
                  value={selectedAgent?.name || ""} 
                  onChange={(e) => selectedAgent && setSelectedAgent({...selectedAgent, name: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={selectedAgent?.description || ""} 
                  onChange={(e) => selectedAgent && setSelectedAgent({...selectedAgent, description: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-white">Ícone</Label>
                <Select 
                  value={selectedAgent?.icon || ""} 
                  onValueChange={(value) => selectedAgent && setSelectedAgent({...selectedAgent, icon: value})}
                >
                  <SelectTrigger className="bg-dark-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-zinc-700">
                    {icons.map((icon) => (
                      <SelectItem key={icon.icon} value={icon.icon} className="text-white hover:bg-dark-600">
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requires_plan" className="text-white">Plano Requerido</Label>
                <Select 
                  value={selectedAgent?.requires_plan || "free"} 
                  onValueChange={(value) => selectedAgent && setSelectedAgent({...selectedAgent, requires_plan: value})}
                >
                  <SelectTrigger className="bg-dark-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-zinc-700">
                    {planTypes.map((plan) => (
                      <SelectItem key={plan} value={plan} className="text-white hover:bg-dark-600">
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_label" className="text-white">Etiqueta de Preço (opcional)</Label>
                <Input 
                  id="price_label" 
                  value={selectedAgent?.price_label || ""} 
                  onChange={(e) => selectedAgent && setSelectedAgent({...selectedAgent, price_label: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white"
                  placeholder="Ex: Contratar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_position" className="text-white">Posição na Lista</Label>
                <Input 
                  id="order_position" 
                  type="number"
                  value={selectedAgent?.order_position || 0} 
                  onChange={(e) => selectedAgent && setSelectedAgent({...selectedAgent, order_position: parseInt(e.target.value)})}
                  className="bg-dark-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={selectedAgent?.is_active || false} 
                  onCheckedChange={(checked) => selectedAgent && setSelectedAgent({...selectedAgent, is_active: checked})}
                />
                <Label htmlFor="is_active" className="text-white">Agente Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-zinc-700 text-white" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-primary text-dark-900 hover:bg-primary/90"
                onClick={updateAgent}
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Agent Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-dark-700 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-white">Adicionar Novo Agente</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Preencha as informações para adicionar um novo agente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome do Agente</Label>
                <Input 
                  id="name" 
                  value={newAgent.name} 
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={newAgent.description || ""} 
                  onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-white">Ícone</Label>
                <Select 
                  value={newAgent.icon || ""} 
                  onValueChange={(value) => setNewAgent({...newAgent, icon: value})}
                >
                  <SelectTrigger className="bg-dark-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-zinc-700">
                    {icons.map((icon) => (
                      <SelectItem key={icon.icon} value={icon.icon} className="text-white hover:bg-dark-600">
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requires_plan" className="text-white">Plano Requerido</Label>
                <Select 
                  value={newAgent.requires_plan || "free"} 
                  onValueChange={(value) => setNewAgent({...newAgent, requires_plan: value})}
                >
                  <SelectTrigger className="bg-dark-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent className="bg-dark-700 border-zinc-700">
                    {planTypes.map((plan) => (
                      <SelectItem key={plan} value={plan} className="text-white hover:bg-dark-600">
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_label" className="text-white">Etiqueta de Preço (opcional)</Label>
                <Input 
                  id="price_label" 
                  value={newAgent.price_label || ""} 
                  onChange={(e) => setNewAgent({...newAgent, price_label: e.target.value})}
                  className="bg-dark-800 border-zinc-700 text-white"
                  placeholder="Ex: Contratar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_position" className="text-white">Posição na Lista</Label>
                <Input 
                  id="order_position" 
                  type="number"
                  value={newAgent.order_position || 0} 
                  onChange={(e) => setNewAgent({...newAgent, order_position: parseInt(e.target.value)})}
                  className="bg-dark-800 border-zinc-700 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={newAgent.is_active || false} 
                  onCheckedChange={(checked) => setNewAgent({...newAgent, is_active: checked})}
                />
                <Label htmlFor="is_active" className="text-white">Agente Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-zinc-700 text-white" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-primary text-dark-900 hover:bg-primary/90"
                onClick={addAgent}
                disabled={!newAgent.name}
              >
                Adicionar Agente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </SuperAdminRoute>
  );
};

export default AgentsAdmin;
