import { useEffect, useState } from "react";
import { Shield, AlertCircle, Users, User, Calendar, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import SuperAdminRoute from "@/components/SuperAdminRoute";

// Define proper interfaces for the data we're working with
interface AuthUser {
  id: string;
  email: string;
  last_sign_in_at: string | null;
  created_at: string;
  banned: boolean;
  confirmed_at: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  status: string;
}

const SuperAdmins = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all users from profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      // Get additional user data from auth
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Erro ao buscar dados de autenticação:", authError);
        
        // If there's an error fetching auth data, we can still display profile data
        const formattedUsers = profiles.map(profile => ({
          id: profile.id,
          email: profile.email || "Email não disponível",
          full_name: profile.full_name || "Nome não disponível",
          last_sign_in_at: null,
          created_at: profile.updated_at || "Data desconhecida",
          status: "unknown"
        }));
        
        setUsers(formattedUsers);
        setTotalUsersCount(formattedUsers.length);
        
        // Estimate active users based on profiles updated recently
        const activeLast30Days = profiles.filter(p => 
          p.updated_at && new Date(p.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        
        setActiveUsersCount(activeLast30Days);
      } else {
        // Ensure that authData.users exists and is an array
        const authUsers = Array.isArray(authData.users) ? authData.users : [];
        
        // Merge auth data with profiles
        const userMap = new Map<string, UserProfile>();
        
        // Type-safe way to iterate over authUsers
        authUsers.forEach((user: any) => {
          // Safely add each auth user to our map with proper type conversion
          userMap.set(user.id, {
            id: user.id,
            email: user.email,
            full_name: null,
            last_sign_in_at: user.last_sign_in_at,
            created_at: user.created_at,
            status: user.banned ? "banned" : (user.confirmed_at ? "active" : "pending")
          });
        });
        
        // Add profile data
        if (profiles) {
          profiles.forEach(profile => {
            if (userMap.has(profile.id)) {
              const userData = userMap.get(profile.id);
              if (userData) {
                userData.full_name = profile.full_name;
                userMap.set(profile.id, userData);
              }
            }
          });
        }
        
        const formattedUsers = Array.from(userMap.values());
        setUsers(formattedUsers);
        setTotalUsersCount(formattedUsers.length);
        
        // Count active users (signed in within last 30 days)
        const activeLast30Days = formattedUsers.filter(user => 
          user.last_sign_in_at && new Date(user.last_sign_in_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        
        setActiveUsersCount(activeLast30Days);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SuperAdminRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Administração do Sistema</h1>
            <p className="text-gray-400">
              Você está acessando a área restrita como administrador principal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-dark-700 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-white">Total de Usuários</CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{totalUsersCount}</div>
                  <p className="text-sm text-gray-400">Usuários registrados</p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-700 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-white">Usuários Ativos</CardTitle>
                  <Activity className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{activeUsersCount}</div>
                  <p className="text-sm text-gray-400">Nos últimos 30 dias</p>
                </CardContent>
              </Card>
              
              <Card className="bg-dark-700 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xl font-medium text-white">Taxa de Atividade</CardTitle>
                  <Calendar className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {totalUsersCount ? Math.round((activeUsersCount / totalUsersCount) * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-400">De usuários ativos</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-dark-700 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-medium text-white">Super Administrador</h2>
                </div>
                <Button variant="outline" onClick={fetchUsers} disabled={loading}>
                  {loading ? "Carregando..." : "Atualizar dados"}
                </Button>
              </div>
              
              <div className="p-4 border border-zinc-800 rounded-lg bg-dark-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-white">Administrador Principal</p>
                      <p className="text-sm text-gray-400">stodmarketing@gmail.com</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Ativo
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 border border-zinc-700 rounded-lg bg-amber-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-500 font-medium">Acesso Restrito</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Apenas o email stodmarketing@gmail.com tem permissão para acessar esta área de administração.
                      Este é um mecanismo de segurança para proteção do sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark-700 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-medium text-white">Usuários do Sistema</h2>
              </div>

              <div className="rounded-md border border-zinc-800">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400">Usuário</TableHead>
                      <TableHead className="text-zinc-400">Email</TableHead>
                      <TableHead className="text-zinc-400">Último acesso</TableHead>
                      <TableHead className="text-zinc-400">Criado em</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-zinc-400">
                          Carregando usuários...
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-zinc-400">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-zinc-800/50">
                          <TableCell className="font-medium text-white">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-zinc-400" />
                              {user.full_name || "Nome não disponível"}
                            </div>
                          </TableCell>
                          <TableCell className="text-zinc-300">{user.email}</TableCell>
                          <TableCell className="text-zinc-400">
                            {formatDate(user.last_sign_in_at)}
                          </TableCell>
                          <TableCell className="text-zinc-400">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center justify-center 
                              ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                                user.status === 'banned' ? 'bg-red-500/20 text-red-400' : 
                                'bg-amber-500/20 text-amber-400'}`}>
                              {user.status === 'active' ? 'Ativo' : 
                               user.status === 'banned' ? 'Banido' : 'Pendente'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </SuperAdminRoute>
  );
};

export default SuperAdmins;
