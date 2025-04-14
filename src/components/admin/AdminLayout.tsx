import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, Package, Palette, CreditCard, Link as LinkIcon, 
  ChevronLeft, ChevronRight, Shield 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuperAdmin } from "@/hooks/useSuperAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { isSuperAdmin } = useSuperAdmin();
  
  const adminMenuItems = [
    {
      icon: Users,
      label: "Gerenciar Agentes",
      path: "/admin/agents",
      superAdminOnly: true
    },
    {
      icon: Package,
      label: "Gerenciar Produtos",
      path: "/admin/products",
      superAdminOnly: true
    },
    {
      icon: Palette,
      label: "Personalizar Tema",
      path: "/admin/theme",
      superAdminOnly: true
    },
    {
      icon: CreditCard,
      label: "Configurar Planos",
      path: "/admin/plans",
      superAdminOnly: true
    },
    {
      icon: LinkIcon,
      label: "Webhooks",
      path: "/admin/webhooks",
      superAdminOnly: true
    },
    {
      icon: Shield,
      label: "Superadmins",
      path: "/admin/superadmins",
      superAdminOnly: true
    }
  ];

  // Filtra os itens do menu baseado no tipo de usuário
  const filteredMenuItems = adminMenuItems.filter(item => !item.superAdminOnly || isSuperAdmin);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Sidebar */}
      <nav className={`fixed left-0 top-0 h-full bg-[#0a0a0a] border-r border-[#191a1a] transition-all duration-300 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex h-16 items-center justify-between px-4">
          {isSidebarCollapsed ? (
            <div className="flex justify-center w-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          ) : (
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold text-white">
                {isSuperAdmin ? "Super Admin Panel" : "Admin Panel"}
              </span>
            </div>
          )}
          
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="rounded-md p-1 text-[#e2e2e2] hover:bg-dark-700 hover:text-primary"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="space-y-1 mt-4 px-2">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex cursor-pointer items-center space-x-3 rounded-md p-3 text-[#e2e2e2] transition-all duration-200",
                location.pathname === item.path
                  ? "bg-dark-700 text-primary"
                  : "hover:bg-dark-700 hover:text-primary"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                location.pathname === item.path && "text-primary"
              )} />
              {!isSidebarCollapsed && (
                <span className="text-[0.95rem]">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
        
        <div className="absolute bottom-4 w-full px-2">
          <Link
            to="/"
            className="flex cursor-pointer items-center space-x-3 rounded-md p-3 text-[#e2e2e2] hover:bg-dark-700 hover:text-primary"
          >
            <ChevronLeft className="h-5 w-5" />
            {!isSidebarCollapsed && (
              <span className="text-[0.95rem]">Voltar ao App</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? "ml-20" : "ml-64"} pt-8`}>
        <div className="mx-auto max-w-[1600px] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
