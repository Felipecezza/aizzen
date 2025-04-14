
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, FileText, AlertCircle, Shield } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface AuthorizedEmail {
  id: string;
  email: string;
  created_at: string;
  notes: string;
  is_active: boolean;
}

const AuthorizedEmails = () => {
  const [emails, setEmails] = useState<AuthorizedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAuthorizedEmails();
  }, []);

  const fetchAuthorizedEmails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("authorized_emails")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setEmails(data || []);
    } catch (error) {
      console.error("Erro ao buscar e-mails autorizados:", error);
      toast.error("Não foi possível carregar a lista de e-mails autorizados");
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("authorized_emails").insert({
        email: newEmail.trim().toLowerCase(),
        notes: notes.trim(),
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Este e-mail já está na lista de autorizados");
        } else {
          toast.error("Erro ao adicionar e-mail: " + error.message);
        }
        return;
      }

      toast.success("E-mail adicionado com sucesso!");
      setNewEmail("");
      setNotes("");
      fetchAuthorizedEmails();
    } catch (error) {
      console.error("Erro ao adicionar e-mail:", error);
      toast.error("Erro ao adicionar e-mail à lista");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmailStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("authorized_emails")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast.success(`E-mail ${currentStatus ? "desativado" : "ativado"} com sucesso!`);
      fetchAuthorizedEmails();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do e-mail");
    }
  };

  const deleteEmail = async (id: string, email: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o e-mail "${email}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("authorized_emails").delete().eq("id", id);

      if (error) {
        throw error;
      }

      toast.success("E-mail removido com sucesso!");
      fetchAuthorizedEmails();
    } catch (error) {
      console.error("Erro ao excluir e-mail:", error);
      toast.error("Erro ao remover e-mail da lista");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <SuperAdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">E-mails Autorizados</h1>
          <p className="text-gray-400">
            Apenas usuários com e-mails nesta lista poderão criar contas no sistema Aizzen.
          </p>

          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium text-white">Adicionar E-mail</CardTitle>
              <Shield className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <form onSubmit={addEmail} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium text-gray-300">
                      Observações (opcional)
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Informações adicionais sobre este e-mail..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white h-[38px] resize-none"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newEmail} 
                  className="flex gap-2 items-center"
                >
                  {isSubmitting ? (
                    <LoadingSpinner className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Adicionar E-mail
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-dark-700 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium text-white">Lista de E-mails Autorizados</CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center my-8">
                  <LoadingSpinner className="h-8 w-8" />
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-zinc-700 rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-zinc-500" />
                  <p className="text-zinc-400">Nenhum e-mail autorizado cadastrado</p>
                  <p className="text-zinc-500 text-sm mt-1">
                    Adicione e-mails para permitir que usuários se registrem no sistema
                  </p>
                </div>
              ) : (
                <div className="border border-zinc-800 rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-zinc-800/50">
                        <TableHead className="text-zinc-400">E-mail</TableHead>
                        <TableHead className="text-zinc-400">Adicionado</TableHead>
                        <TableHead className="text-zinc-400">Observações</TableHead>
                        <TableHead className="text-zinc-400">Status</TableHead>
                        <TableHead className="text-zinc-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emails.map((email) => (
                        <TableRow key={email.id} className="hover:bg-zinc-800/50">
                          <TableCell className="font-medium text-white">{email.email}</TableCell>
                          <TableCell className="text-zinc-400">
                            {formatDate(email.created_at)}
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {email.notes || "-"}
                          </TableCell>
                          <TableCell>
                            <div
                              className={`px-2 py-1 text-xs rounded-full inline-flex items-center justify-center ${
                                email.is_active
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {email.is_active ? "Ativo" : "Inativo"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleEmailStatus(email.id, email.is_active)}
                                className={`h-8 w-8 ${
                                  email.is_active
                                    ? "hover:bg-red-500/10 hover:text-red-400"
                                    : "hover:bg-green-500/10 hover:text-green-400"
                                }`}
                              >
                                <span className="sr-only">
                                  {email.is_active ? "Desativar" : "Ativar"}
                                </span>
                                {email.is_active ? (
                                  <AlertCircle className="h-4 w-4" />
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteEmail(email.id, email.email)}
                                className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <span className="sr-only">Remover</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border border-amber-500/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-500 font-medium">Importante</p>
                  <p className="text-sm text-gray-400 mt-1">
                    O sistema verifica esta lista no momento do registro. Usuários com e-mails não autorizados 
                    receberão uma mensagem de erro informando que precisam entrar em contato com o suporte.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </SuperAdminRoute>
  );
};

export default AuthorizedEmails;
