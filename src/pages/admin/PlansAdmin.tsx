import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  PlusCircle, Edit, Trash2, MessageSquare, Check, 
  AlertTriangle, CheckCircle2, XCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SuperAdminRoute from "@/components/SuperAdminRoute";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  period: string;
  messages_limit: number;
  highlight: boolean;
  features?: string[];
}

interface PlanFeature {
  id: string;
  plan_id: string;
  feature: string;
}

const PlansAdmin = () => {
  const queryClient = useQueryClient();
  const [editPlanDialog, setEditPlanDialog] = useState(false);
  const [deletePlanDialog, setDeletePlanDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [planFeatures, setPlanFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "",
      price: 0,
      period: "/mês",
      messages_limit: 0,
      highlight: false,
    }
  });

  const { data: plans = [], isLoading: plansLoading, refetch: refetchAdminPlans } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current user session:", session);
      
      const { data: plansData, error: plansError } = await supabase
        .from("pricing_plans")
        .select("*")
        .order("price");
      
      if (plansError) {
        console.error("Error fetching plans:", plansError);
        toast.error("Erro ao carregar planos");
        throw plansError;
      }
      
      const plansWithFeatures = await Promise.all(
        plansData.map(async (plan) => {
          const { data: features, error: featuresError } = await supabase
            .from("plan_features")
            .select("feature")
            .eq("plan_id", plan.id);
          
          if (featuresError) {
            console.error("Error fetching features:", featuresError);
            return { ...plan, features: [] };
          }
          
          return { 
            ...plan, 
            features: features.map(f => f.feature) 
          };
        })
      );
      
      return plansWithFeatures;
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: Omit<Plan, "id">) => {
      console.log("Creating new plan:", data);
      setIsSaving(true);
      
      try {
        const { data: newPlan, error } = await supabase
          .from("pricing_plans")
          .insert({
            name: data.name,
            type: data.type,
            price: data.price,
            period: data.period,
            messages_limit: data.messages_limit,
            highlight: data.highlight,
          })
          .select("*")
          .single();
        
        if (error) {
          console.error("Error creating plan:", error);
          throw error;
        }
        
        console.log("New plan created:", newPlan);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (planFeatures.length > 0) {
          const featuresAdded = [];
          
          for (const feature of planFeatures) {
            try {
              const { data: featureData, error: featureError } = await supabase
                .from("plan_features")
                .insert({
                  plan_id: newPlan.id,
                  feature: feature
                })
                .select("*")
                .single();
              
              if (featureError) {
                console.error("Error adding feature:", featureError, feature);
                // Continue adding other features instead of throwing
              } else {
                featuresAdded.push(feature);
                console.log("Added feature:", feature);
              }
              
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (err) {
              console.error("Insertion exception:", err);
            }
          }
          
          console.log("Features added:", featuresAdded);
        }
        
        return newPlan;
      } finally {
        setIsSaving(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] }); 
      
      refetchAdminPlans();
      
      resetForm();
      setEditPlanDialog(false);
      toast.success("Plano criado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating plan:", error);
      toast.error("Erro ao criar plano");
      setIsSaving(false);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (data: Plan) => {
      console.log("Updating plan:", data);
      setIsSaving(true);
      
      try {
        const { error: updateError } = await supabase
          .from("pricing_plans")
          .update({
            name: data.name,
            type: data.type,
            price: data.price,
            period: data.period,
            messages_limit: data.messages_limit,
            highlight: data.highlight,
          })
          .eq("id", data.id);
        
        if (updateError) {
          console.error("Error updating plan:", updateError);
          toast.error(`Erro ao atualizar dados do plano: ${updateError.message}`);
          throw updateError;
        }
        
        console.log("Plan basic info updated successfully");
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { error: deleteError } = await supabase
          .from("plan_features")
          .delete()
          .eq("plan_id", data.id);
        
        if (deleteError) {
          console.error("Error deleting old features:", deleteError);
          toast.error(`Erro ao remover funcionalidades antigas: ${deleteError.message}`);
          throw deleteError;
        }
        
        console.log("Old features deleted successfully");
        
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const featuresAdded = [];
        
        if (planFeatures.length > 0) {
          for (const feature of planFeatures) {
            try {
              const { data: featureData, error: featureError } = await supabase
                .from("plan_features")
                .insert({
                  plan_id: data.id,
                  feature: feature
                })
                .select("*")
                .single();
              
              if (featureError) {
                console.error("Error adding feature:", featureError, feature);
                toast.error(`Erro ao adicionar funcionalidade "${feature}": ${featureError.message}`);
              } else {
                featuresAdded.push(feature);
                console.log("Added feature:", feature);
              }
              
              await new Promise(resolve => setTimeout(resolve, 800));
            } catch (err) {
              console.error("Feature insertion error:", err);
            }
          }
        }
        
        console.log("Features added:", featuresAdded);
        
        const { data: updatedPlan, error: fetchError } = await supabase
          .from("pricing_plans")
          .select("*")
          .eq("id", data.id)
          .single();
        
        if (fetchError) {
          console.error("Error fetching updated plan:", fetchError);
          throw fetchError;
        }
        
        return {
          ...updatedPlan,
          features: featuresAdded
        };
      } finally {
        setIsSaving(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] }); 
      
      setTimeout(() => {
        refetchAdminPlans();
      }, 1000);
      
      setEditPlanDialog(false);
      resetForm();
      toast.success("Plano atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating plan:", error);
      toast.error(`Erro ao atualizar plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setIsSaving(false);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting plan:", id);
      
      const { error: featuresError } = await supabase
        .from("plan_features")
        .delete()
        .eq("plan_id", id);
      
      if (featuresError) {
        console.error("Error deleting plan features:", featuresError);
        throw featuresError;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase
        .from("pricing_plans")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error deleting plan:", error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      refetchAdminPlans();
      setDeletePlanDialog(false);
      toast.success("Plano excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting plan:", error);
      toast.error("Erro ao excluir plano");
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      type: "",
      price: 0,
      period: "/mês",
      messages_limit: 0,
      highlight: false
    });
    setPlanFeatures([]);
    setNewFeature("");
    setCurrentPlan(null);
  };

  const handleCreatePlan = (data: Omit<Plan, "id">) => {
    createPlanMutation.mutate(data);
  };

  const handleUpdatePlan = (data: any) => {
    if (!currentPlan) return;
    
    updatePlanMutation.mutate({
      ...data,
      id: currentPlan.id,
    });
  };

  const handleDeletePlan = () => {
    if (!currentPlan) return;
    deletePlanMutation.mutate(currentPlan.id);
  };

  const handleEditPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setPlanFeatures(plan.features || []);
    form.reset({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      period: plan.period,
      messages_limit: plan.messages_limit,
      highlight: plan.highlight,
    });
    setEditPlanDialog(true);
  };

  const handleDeletePlanClick = (plan: Plan) => {
    setCurrentPlan(plan);
    setDeletePlanDialog(true);
  };

  const addFeature = () => {
    if (newFeature.trim() === '') return;
    setPlanFeatures([...planFeatures, newFeature]);
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    const updated = [...planFeatures];
    updated.splice(index, 1);
    setPlanFeatures(updated);
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      refetchAdminPlans();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [refetchAdminPlans]);

  return (
    <SuperAdminRoute>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Gerenciar Planos</h1>
            <Button 
              onClick={() => {
                resetForm();
                setEditPlanDialog(true);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Total de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{plans.length}</div>
              </CardContent>
            </Card>
          </div>

          {plansLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-400">Carregando planos...</p>
            </div>
          ) : (
            <div className="bg-dark-700 rounded-lg border border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Limite de Mensagens</TableHead>
                    <TableHead>Destaque</TableHead>
                    <TableHead>Funcionalidades</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                        Nenhum plano encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>
                          {plan.price ? `R$ ${plan.price}${plan.period}` : "Grátis"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1 text-primary" />
                            <span>{plan.messages_limit}/dia</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.highlight ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {plan.features && plan.features.length > 0 ? (
                              <div className="space-y-1">
                                {plan.features.slice(0, 2).map((feature, i) => (
                                  <div key={i} className="flex items-center text-sm">
                                    <Check className="h-3 w-3 mr-1 text-primary" />
                                    <span className="truncate">{feature}</span>
                                  </div>
                                ))}
                                {plan.features.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    + {plan.features.length - 2} mais
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Sem funcionalidades</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPlan(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePlanClick(plan)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <Dialog open={editPlanDialog} onOpenChange={setEditPlanDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {currentPlan ? "Editar Plano" : "Criar Novo Plano"}
                </DialogTitle>
                <DialogDescription>
                  {currentPlan
                    ? "Atualize os detalhes do plano abaixo."
                    : "Preencha os detalhes para o novo plano."}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    currentPlan ? handleUpdatePlan : handleCreatePlan
                  )}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Plano</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: Plano Básico"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: basic"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="period"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Período</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ex: /mês"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="messages_limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limite de Mensagens (por dia)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="ex: 300"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="highlight"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-zinc-800 p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Destacar Plano</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormLabel>Funcionalidades do Plano</FormLabel>
                    
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Adicionar nova funcionalidade"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                      />
                      <Button type="button" onClick={addFeature}>
                        Adicionar
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-[200px] overflow-y-auto p-2">
                      {planFeatures.map((feature, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-dark-800 rounded-md"
                        >
                          <div className="flex items-center">
                            <Check className="h-4 w-4 mr-2 text-primary" />
                            <span>{feature}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {planFeatures.length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                          Nenhuma funcionalidade adicionada
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button" 
                        onClick={() => {
                          resetForm();
                          setEditPlanDialog(false);
                        }}
                        disabled={isSaving}
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-current rounded-full mr-2"></div>
                          {currentPlan ? "Atualizando..." : "Criando..."}
                        </>
                      ) : (
                        <>{currentPlan ? "Atualizar Plano" : "Criar Plano"}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={deletePlanDialog} onOpenChange={setDeletePlanDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Plano</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir o plano "{currentPlan?.name}"? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeletePlan}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </AdminLayout>
    </SuperAdminRoute>
  );
};

export default PlansAdmin;
