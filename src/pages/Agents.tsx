
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { colors } from "@/styles/colors";

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

const Agents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const { toast } = useToast();

  const { data: connections, isLoading: isLoadingConnections } = useQuery({
    queryKey: ["whatsapp-connections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("whatsapp_connections")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching connections:", error);
        throw error;
      }

      return data as WhatsappConnection[];
    },
  });

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image_url");

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      return data as Product[];
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConnection || !selectedProduct) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione uma conexão e um produto.",
        variant: "destructive",
      });
      return;
    }

    // Here you would handle the agent activation with the selected connection and product
    console.log("Selected connection:", selectedConnection);
    console.log("Selected product:", selectedProduct);
    
    toast({
      title: "Agente ativado",
      description: "O agente foi configurado com sucesso.",
    });
    
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Agentes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Agente Vendedor - Disponível */}
          <div className="rounded-lg bg-dark-700 p-6 space-y-4 border border-zinc-800">
            <h3 className="text-lg font-semibold text-white">Agente Vendedor</h3>
            <p className="text-zinc-400 text-sm">
              Automatize suas vendas com um agente especializado em converter leads em clientes.
              Configure produtos, preços e áreas de atuação.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-primary hover:bg-primary/90 text-dark-700">
                  Ativar Agente
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-dark-700 text-white border-zinc-800">
                <DialogHeader>
                  <DialogTitle>Configurar Agente Vendedor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="connection">Selecione a Conexão WhatsApp</Label>
                    <Select
                      value={selectedConnection}
                      onValueChange={setSelectedConnection}
                    >
                      <SelectTrigger className="bg-dark-700 border-zinc-800">
                        <SelectValue placeholder="Selecione uma conexão" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-700 border-zinc-800">
                        {connections?.map((connection) => (
                          <SelectItem 
                            key={connection.id} 
                            value={connection.id}
                            className="text-white hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:text-white py-1.5"
                          >
                            {connection.instance_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </div>

          {/* Agente de Suporte - Bloqueado */}
          <div className="rounded-lg bg-dark-700 p-6 space-y-4 relative border border-zinc-800">
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 text-primary mx-auto" />
                <p className="text-white">Disponível no plano Escale</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Agente de Suporte</h3>
            <p className="text-zinc-400 text-sm">
              Ofereça suporte 24/7 aos seus clientes com respostas automáticas
              inteligentes e escalonamento para atendimento humano quando necessário.
            </p>
            <Button disabled className="w-full bg-zinc-800 text-white">
              Ativar Agente
            </Button>
          </div>

          {/* Agente de Recuperação - Bloqueado */}
          <div className="rounded-lg bg-dark-700 p-6 space-y-4 relative border border-zinc-800">
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Lock className="h-8 w-8 text-primary mx-auto" />
                <p className="text-white">Disponível no plano Pro</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white">Agente de Recuperação</h3>
            <p className="text-zinc-400 text-sm">
              Recupere vendas perdidas automaticamente com follow-ups inteligentes
              e ofertas personalizadas para cada cliente.
            </p>
            <Button disabled className="w-full bg-zinc-800 text-white">
              Ativar Agente
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Agents;
