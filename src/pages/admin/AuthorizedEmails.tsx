import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PlusCircle, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

type AuthorizedEmail = {
  id: string;
  email: string;
  created_at: string;
  created_by: string;
  owner_name?: string;
}

const AuthorizedEmails = () => {
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchAuthorizedEmails();
  }, []);
  
  const fetchAuthorizedEmails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setEmails(data || []);
    } catch (error) {
      console.error('Erro ao buscar emails autorizados:', error);
      toast.error('Não foi possível carregar a lista de emails autorizados');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verificar se o email já existe
      const { data: existingEmails } = await supabase
        .from('authorized_emails')
        .select('email')
        .eq('email', newEmail.toLowerCase().trim());
      
      if (existingEmails && existingEmails.length > 0) {
        toast.error('Este email já está autorizado');
        setIsSubmitting(false);
        return;
      }
      
      // Obter dados do usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Você precisa estar logado para adicionar emails');
        setIsSubmitting(false);
        return;
      }
      
      // Adicionar novo email
      const { error } = await supabase
        .from('authorized_emails')
        .insert({
          email: newEmail.toLowerCase().trim(),
          created_by: user.id
        });
      
      if (error) throw error;
      
      toast.success('Email autorizado com sucesso');
      setNewEmail("");
      fetchAuthorizedEmails();
    } catch (error) {
      console.error('Erro ao adicionar email:', error);
      toast.error('Não foi possível adicionar o email');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from('authorized_emails')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Email removido com sucesso');
      setEmails(emails.filter(email => email.id !== id));
    } catch (error) {
      console.error('Erro ao remover email:', error);
      toast.error('Não foi possível remover o email');
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Emails Autorizados</h1>
        
        <div className="space-y-6">
          <div className="bg-dark-700 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Adicionar Email</h2>
            
            <form onSubmit={handleAddEmail} className="flex gap-2">
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                  </>
                )}
              </Button>
            </form>
            
            <p className="mt-2 text-sm text-zinc-400">
              Apenas emails autorizados podem se registrar na plataforma.
            </p>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Lista de Emails</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <LoadingSpinner className="h-6 w-6" />
              </div>
            ) : emails.length === 0 ? (
              <p className="text-zinc-400 text-center py-8">
                Nenhum email autorizado ainda. Adicione o primeiro email acima.
              </p>
            ) : (
              <div className="space-y-2">
                {emails.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-3 bg-zinc-800 rounded-md"
                  >
                    <div>
                      <p className="font-medium text-white">{item.email}</p>
                      <p className="text-xs text-zinc-400">
                        Adicionado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteEmail(item.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuthorizedEmails; 