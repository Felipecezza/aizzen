import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteAccountButtonProps {
  configId: string;
  onSuccess: () => void;
}

export const DeleteAccountButton = ({ configId, onSuccess }: DeleteAccountButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("Starting deletion process for config ID:", configId);

      const { error } = await supabase
        .from("chatwoot_configs")
        .delete()
        .eq("id", configId);

      if (error) {
        console.error("Error deleting config:", error);
        throw error;
      }

      console.log("Successfully deleted config:", configId);
      
      toast.success("Conta removida com sucesso");
      setIsOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error in deletion process:", error);
      toast.error(error.message || "Erro ao remover conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Remover conta</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Tem certeza que deseja remover esta conta? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Remover"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};