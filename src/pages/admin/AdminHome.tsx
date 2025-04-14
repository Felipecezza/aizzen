import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Package, Palette, CreditCard, Link as LinkIcon, 
  Shield, DollarSign, ArrowUpRight, BarChart2
} from "lucide-react";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FinancialSummary {
  total_users: number;
  paying_users: number;
  total_monthly_revenue: number;
  plans_breakdown: {
    plan_type: string;
    user_count: number;
    plan_price: number;
    total_revenue: number;
  }[];
}

const AdminHome = () => {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup the first superadmin if needed
  useEffect(() => {
    const setupFirstSuperAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Check if there are any superadmins
        const { count, error } = await supabase
          .from('superadmins')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error("Error checking superadmins:", error);
          return;
        }
        
        // If no superadmins exist, make the current user a superadmin
        if (count === 0) {
          const { error: insertError } = await supabase
            .from('superadmins')
            .insert({ user_id: user.id });
          
          if (!insertError) {
            toast({
              title: "Acesso administrativo criado",
              description: "Você foi definido como o primeiro superadmin do sistema",
            });
          }
        }
      } catch (error) {
        console.error("Error setting up first superadmin:", error);
      }
    };
    
    setupFirstSuperAdmin();
  }, []);

  // Fetch financial dashboard data
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        
        // Get dashboard data from the financial_dashboard view
        const { data: dashboardData, error: dashboardError } = await supabase
          .from('financial_dashboard')
          .select('*');
          
        if (dashboardError) throw dashboardError;
        
        // Get total user count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Calculate paying users and total revenue
        let totalRevenue = 0;
        let payingUsers = 0;
        
        dashboardData.forEach(item => {
          if (item.plan_type !== 'free') {
            payingUsers += item.user_count;
            totalRevenue += item.total_revenue;
          }
        });
        
        setFinancialData({
          total_users: totalUsers || 0,
          paying_users: payingUsers,
          total_monthly_revenue: totalRevenue,
          plans_breakdown: dashboardData
        });
      } catch (error) {
        console.error("Error fetching financial data:", error);
        toast({
          title: "Erro ao carregar dados financeiros",
          description: "Não foi possível carregar os dados financeiros",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, []);

  const adminCards = [
    {
      title: "Gerenciar Agentes",
      description: "Adicionar, editar e remover agentes disponíveis para os usuários",
      icon: Users,
      path: "/admin/agents",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Gerenciar Produtos",
      description: "Cadastrar e editar produtos disponíveis no sistema",
      icon: Package,
      path: "/admin/products",
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Personalizar Tema",
      description: "Editar as cores principais do tema do aplicativo",
      icon: Palette,
      path: "/admin/theme",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Configurar Planos",
      description: "Editar valores e recursos dos planos de assinatura",
      icon: CreditCard,
      path: "/admin/plans",
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Webhooks",
      description: "Configurar webhooks para integrações do sistema",
      icon: LinkIcon,
      path: "/admin/webhooks",
      color: "bg-rose-500/10 text-rose-500",
    },
    {
      title: "Gerenciar Superadmins",
      description: "Adicionar ou remover usuários com privilégios de superadmin",
      icon: Shield,
      path: "/admin/superadmins",
      color: "bg-primary/10 text-primary",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SuperAdminRoute>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-white">Painel de Administração</h1>
          <p className="text-gray-400">
            Bem-vindo ao painel de administração. Aqui você pode gerenciar todos os aspectos do sistema.
          </p>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Card className="bg-dark-700 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium text-white">Total de Usuários</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loading ? "..." : financialData?.total_users}
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-400">
                    {loading ? "..." : `${financialData?.paying_users} pagantes`}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-700 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium text-white">Receita Mensal</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loading ? "..." : formatCurrency(financialData?.total_monthly_revenue || 0)}
                </div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+0% este mês</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-dark-700 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium text-white">Ticket Médio</CardTitle>
                <BarChart2 className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {loading || financialData?.paying_users === 0 ? 
                    "..." : 
                    formatCurrency(financialData?.total_monthly_revenue! / financialData?.paying_users! || 0)
                  }
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-400">Por usuário pagante</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Plan breakdown */}
          {!loading && financialData && (
            <Card className="bg-dark-700 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Detalhamento por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.plans_breakdown.map((plan) => (
                    <div key={plan.plan_type} className="flex justify-between items-center border-b border-zinc-800 pb-3">
                      <div>
                        <p className="text-white font-medium capitalize">
                          {plan.plan_type === 'free' ? 'Free' : 
                           plan.plan_type === 'pro' ? 'Pro' : 
                           plan.plan_type === 'escale' ? 'Escale' : 
                           plan.plan_type}
                        </p>
                        <p className="text-sm text-gray-400">{plan.user_count} usuários</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{formatCurrency(plan.total_revenue)}</p>
                        <p className="text-sm text-gray-400">{formatCurrency(plan.plan_price)}/usuário</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {adminCards.map((card) => (
              <Card 
                key={card.path} 
                className="bg-dark-700 border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all duration-200"
                onClick={() => navigate(card.path)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-white text-lg font-medium">{card.title}</CardTitle>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-400">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SuperAdminRoute>
    </div>
  );
};

export default AdminHome;
