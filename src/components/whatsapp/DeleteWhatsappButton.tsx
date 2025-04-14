import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { WEBHOOK_ENDPOINTS, callWebhook } from "@/utils/webhookConfig";

interface DeleteWhatsappButtonProps {
  connectionId: string;
  onDelete: (connectionId: string) => void;
}

export const DeleteWhatsappButton = ({
  connectionId,
  onDelete
}: DeleteWhatsappButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Primeiro, busca os dados da conexão para obter o instance_name
      const {
        data: connection,
        error: fetchError
      } = await supabase.from("whatsapp_connections").select("instance_name").eq("id", connectionId).single();
      
      if (fetchError) {
        console.error("Erro ao buscar dados da conexão:", fetchError);
        throw new Error("Erro ao buscar dados da conexão");
      }
      
      if (!connection?.instance_name) {
        throw new Error("Nome da instância não encontrado");
      }
      
      console.log("Deletando conexão do banco de dados:", connectionId);

      // Primeiro deleta a conexão do banco de dados
      const {
        error: deleteError
      } = await supabase.from("whatsapp_connections").delete().eq("id", connectionId);
      
      if (deleteError) {
        console.error("Erro ao deletar conexão:", deleteError);
        throw deleteError;
      }
      
      console.log("Enviando webhook para excluir conexão:", connection.instance_name);

      // Depois envia o webhook para excluir a conexão usando o nome completo da instância
      try {
        await callWebhook(WEBHOOK_ENDPOINTS.DELETAR_INSTANCIA, {
          instanceName: connection.instance_name // Usando o nome completo da instância
        });
      } catch (webhookError) {
        console.error("Erro ao enviar webhook de exclusão:", webhookError);
        toast({
          title: "Erro parcial",
          description: "Erro ao enviar webhook, mas a conexão foi removida do banco de dados",
          variant: "destructive",
        });
      }
      
      // Adiciona uma notificação
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          message: `Conexão ${connection.instance_name} foi removida`,
          type: "whatsapp_delete"
        });
        
      if (notificationError) {
        console.error("Erro ao adicionar notificação:", notificationError);
      }
      
      toast({
        title: "Sucesso",
        description: "Conexão removida com sucesso",
        variant: "success",
      });
      setIsOpen(false);

      // Call the onDelete callback to update the UI
      onDelete(connectionId);
    } catch (error: any) {
      console.error("Error deleting connection:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="icon" 
          className="bg-destructive/10 text-destructive hover:bg-destructive/20 h-14 w-14 flex items-center justify-center aspect-square"
        >
          <Trash2 className="w-8 h-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-dark-700 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Remover conexão</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Tem certeza que deseja remover esta conexão? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-dark-700 text-white border-zinc-800 hover:bg-zinc-800">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive/10 text-destructive hover:bg-destructive/20">
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Remover"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
};
